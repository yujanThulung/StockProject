
import { create } from "zustand";
import axios from "axios";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

// Connect to backend WebSocket
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

      let notifications = data.notifications || [];

      if (triggered === true) {
        notifications = notifications.filter((n) => n.triggered === true);
        set({
          notifications,
          triggeredCount: notifications.length,
          loading: false,
        });
      } else {
        set({ notifications, loading: false });
      }

      console.log(
        `✅ Fetched ${notifications.length} notifications (triggered=${triggered})`
      );
    } catch (err) {
      set({
        error: err.response?.data?.error || err.message,
        loading: false,
      });
      console.error("❌ Fetch notifications error:", err);
    }
  },

  // 📡 Listen for price alerts (real-time)
  listenForAlerts: (userId) => {
    socket.on("price_alert", (payload) => {
      if (payload && payload.message && payload.symbol) {
        toast(`🔔 ${payload.symbol} Alert: ${payload.message}`, {
          duration: 5000,
          position: "top-right",
        });

        set((state) => ({
          triggeredCount: state.triggeredCount + 1,
        }));

        console.log("🚨 Realtime alert received:", payload);
      }
    });

    socket.emit("join", userId); // Ask backend to join room for this user
    console.log("📡 Listening for alerts for user:", userId);
  },

  // ➕ Add notification
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

      console.log(
        `✅ Notification created: ${symbol} ${condition} $${targetPrice.toFixed(
          2
        )}`
      );
      return { success: true, message: "Notification created successfully" };
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      set({ error: errorMsg, loading: false });
      console.error("❌ Add notification error:", err);
      return { success: false, message: errorMsg };
    }
  },

  // ✏️ Update notification
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

      console.log(
        `✅ Notification updated: ${data.symbol} (${condition}) $${targetPrice}`
      );
      return { success: true, message: "Notification updated successfully" };
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      set({ error: errorMsg, loading: false });
      console.error("❌ Update notification error:", err);
      return { success: false, message: errorMsg };
    }
  },

  // 🗑️ Delete notification
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
      console.log(`🗑️ Notification deleted: ${data.message}`);
      return { success: true, message: data.message };
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      set({ error: errorMsg, loading: false });
      console.error("❌ Delete notification error:", err);
      return { success: false, message: errorMsg };
    }
  },
}));

export default useNotificationStore;
