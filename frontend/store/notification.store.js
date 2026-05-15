import { create } from 'zustand';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import api from '../src/lib/axios.js';

const socket = io('http://localhost:8000', {
  withCredentials: true,
  transports: ['websocket'],
});

const useNotificationStore = create((set) => ({
  notifications: [],
  triggeredCount: 0,
  loading: false,
  error: null,

  // Fetch notifications
  fetchNotifications: async (triggered = null) => {
    set({ loading: true, error: null });
    try {
      const query = triggered === null ? '' : `?triggered=${triggered}`;
      const { data } = await api.get(`/alert/view${query}`);
      const notifications = data.notifications || [];

      set({
        notifications,
        triggeredCount: notifications.filter((n) => n.triggered).length,
        loading: false,
      });
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      set({ error: errorMsg, loading: false });
    }
  },

  // Real-time alert listener
  listenForAlerts: (userId) => {
    socket.emit('join-room', userId);

    socket.off('alert_triggered');
    socket.on('alert_triggered', (payload) => {
      const { symbol, message, targetPrice, condition } = payload || {};
      if (symbol && message) {
        toast.success(`${symbol} Alert: ${message}`, {
          duration: 5000,
          position: 'top-right',
        });

        set((state) => ({
          notifications: [
            {
              _id: new Date().toISOString(),
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
      }
    });
  },

  // Add new alert
  addNotification: async ({ symbol, targetPrice, message, condition }) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/alert/add', {
        symbol,
        targetPrice,
        message,
        condition,
      });

      set((state) => ({
        notifications: [...state.notifications, data],
        loading: false,
      }));

      return { success: true, message: 'Notification created successfully' };
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      set({ error: errorMsg, loading: false });
      return { success: false, message: errorMsg };
    }
  },

  // Update alert
  updateNotification: async (id, { targetPrice, message, condition }) => {
    set({ loading: true, error: null });
    try {
      await api.put(`/alert/update/${id}`, { targetPrice, message, condition });

      set((state) => ({
        notifications: state.notifications.map((n) =>
          n._id === id ? { ...n, targetPrice, message, condition } : n
        ),
        loading: false,
      }));

      return { success: true, message: 'Notification updated successfully' };
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      set({ error: errorMsg, loading: false });
      return { success: false, message: errorMsg };
    }
  },

  // Delete alert
  deleteNotification: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.delete(`/alert/delete/${id}`);

      set((state) => ({
        notifications: state.notifications.filter((n) => n._id !== id),
        loading: false,
      }));

      return { success: true, message: data.message };
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      set({ error: errorMsg, loading: false });
      return { success: false, message: errorMsg };
    }
  },
}));

export default useNotificationStore;
