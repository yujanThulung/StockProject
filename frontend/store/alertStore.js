// File: src/store/alertStore.js

import { create } from 'zustand';
import axios from 'axios';
import { subscribeToFinnhub, unsubscribeFromFinnhub } from '../utils';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8000/api";

const useAlertStore = create((set) => ({
    alerts: [],
    loading: false,
    error: null,

    // Fetch all alerts for the current user
    fetchAlerts: async () => {
        set({ loading: true, error: null });
        try {
            const { data } = await axios.get('/alert');
            set({ alerts: data, loading: false });

            data.forEach(alert => subscribeToFinnhub(alert.symbol));
        } catch (err) {
            const error = err.response?.data?.error || "Failed to fetch alerts";
            set({ error, loading: false });
        }
    },

    // Add a new alert
    addAlert: async (alertData) => {
        set({ loading: true, error: null });
        try {
            const { data } = await axios.post('/alert', alertData);
            set((state) => ({
                alerts: [...state.alerts, data],
                loading: false,
            }));
            subscribeToFinnhub(data.symbol);
        } catch (err) {
            const error = err.response?.data?.error || "Failed to add alert";
            set({ error, loading: false });
        }
    },

    // Update an alert
    updateAlert: async (id, updatedData) => {
        set({ loading: true, error: null });
        try {
            const { data } = await axios.put(`/alert/${id}`, updatedData);
            set((state) => ({
                alerts: state.alerts.map((a) => (a._id === id ? data : a)),
                loading: false,
            }));
            subscribeToFinnhub(data.symbol);
        } catch (err) {
            const error = err.response?.data?.error || "Failed to update alert";
            set({ error, loading: false });
        }
    },

    // Delete an alert
    deleteAlert: async (id) => {
        set({ loading: true, error: null });
        try {
            await axios.delete(`/alert/${id}`);
            set((state) => ({
                alerts: state.alerts.filter((a) => a._id !== id),
                loading: false,
            }));
            // You can optionally unsubscribe here:
            // unsubscribeFromFinnhub(symbol);
        } catch (err) {
            const error = err.response?.data?.error || "Failed to delete alert";
            set({ error, loading: false });
        }
    },
}));

export default useAlertStore;
