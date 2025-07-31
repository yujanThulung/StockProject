import { create } from "zustand";
import axios from "axios";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

// ✅ WebSocket setup
const socket = io("http://localhost:8000", {
    withCredentials: true,
    transports: ["websocket"],
});

const useNotificationStore = create((set, get) => ({
    notifications: [],
    triggeredCount: 0,
    loading: false,
    error: null,

    // 📥 Fetch notifications
    fetchNotifications: async (triggered = null) => {
        set({ loading: true, error: null });
        try {
            const query = triggered === null ? "" : `?triggered=${triggered}`;
            const { data } = await axios.get(`/alert/view${query}`, {
                withCredentials: true,
            });

            const notifications = data.notifications || [];

            set({
                notifications,
                triggeredCount: notifications.filter((n) => n.triggered).length,
                loading: false,
            });

            console.log(
                `✅ Fetched ${notifications.length} notifications (triggered=${triggered})`
            );
        } catch (err) {
            const errorMsg = err.response?.data?.error || err.message;
            set({ error: errorMsg, loading: false });
            console.error("❌ Fetch notifications error:", errorMsg);
        }
    },

    // 📡 Real-time alert listener
    listenForAlerts: (symbol) => {
        socket.emit("join-room", symbol); 
        console.log("📡 Listening for alerts for user from socket:", symbol);

        socket.off("alert_triggered");
        socket.on("alert_triggered", (payload) => {
            const { symbol, message, targetPrice, condition } = payload || {};
            if (symbol && message) {
                toast.success(`🔔 ${symbol} Alert: ${message}`, {
                    duration: 5000,
                    position: "top-right",
                });

                set((state) => ({
                    notifications: [
                        {
                            _id: new Date().toISOString(), // temp ID
                            symbol,
                            message,
                            targetPrice,
                            condition,
                            triggered: true,
                            createdAt: new Date().toISOString(),
                        },
                        ...state.notifications,
                    ],
                    triggeredCount: state.triggeredCount + 1,
                }));

                console.log("🚨 Real-time alert received:", payload);
            }
        });
    },

    // ➕ Add new alert
    addNotification: async ({ symbol, targetPrice, message, condition }) => {
        set({ loading: true, error: null });
        try {
            const { data } = await axios.post(
                "/alert/add",
                { symbol, targetPrice, message, condition },
                { withCredentials: true }
            );

            set((state) => ({
                notifications: [...state.notifications, data],
                loading: false,
            }));

            console.log(`✅ Created: ${symbol} ${condition} $${targetPrice.toFixed(2)}`);
            return { success: true, message: "Notification created successfully" };
        } catch (err) {
            const errorMsg = err.response?.data?.error || err.message;
            set({ error: errorMsg, loading: false });
            console.error("❌ Add error:", errorMsg);
            return { success: false, message: errorMsg };
        }
    },

    // ✏️ Update alert
    updateNotification: async (id, { targetPrice, message, condition }) => {
        set({ loading: true, error: null });
        try {
            const { data } = await axios.put(
                `/alert/update/${id}`,
                { targetPrice, message, condition },
                { withCredentials: true }
            );

            set((state) => ({
                notifications: state.notifications.map((n) =>
                    n._id === id ? { ...n, targetPrice, message, condition } : n
                ),
                loading: false,
            }));

            console.log(`✅ Updated: ${data.symbol} (${condition}) $${targetPrice}`);
            return { success: true, message: "Notification updated successfully" };
        } catch (err) {
            const errorMsg = err.response?.data?.error || err.message;
            set({ error: errorMsg, loading: false });
            console.error("❌ Update error:", errorMsg);
            return { success: false, message: errorMsg };
        }
    },

    // 🗑️ Delete alert
    deleteNotification: async (id) => {
        set({ loading: true, error: null });
        try {
            const { data } = await axios.delete(`/alert/delete/${id}`, {
                withCredentials: true,
            });

            set((state) => ({
                notifications: state.notifications.filter((n) => n._id !== id),
                loading: false,
            }));

            console.log(`🗑️ Deleted: ${data.message}`);
            return { success: true, message: data.message };
        } catch (err) {
            const errorMsg = err.response?.data?.error || err.message;
            set({ error: errorMsg, loading: false });
            console.error("❌ Delete error:", errorMsg);
            return { success: false, message: errorMsg };
        }
    },
}));

export default useNotificationStore;
