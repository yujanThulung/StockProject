// File: src/store/authStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8000/api";

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            loading: false,
            error: null,
            isAuthenticated: false,

            // Signup action
            signup: async (userData) => {
                set({ loading: true, error: null });
                try {
                    const { data } = await axios.post("/signup", {
                        name: userData.name,
                        email: userData.email,
                        password: userData.password,
                        role: userData.role || "user",
                    });

                    if (data.success) {
                        set({
                            user: data.data,
                            isAuthenticated: true,
                            loading: false,
                        });
                        return { success: true };
                    } else {
                        set({ error: data.message, loading: false });
                        return { success: false, message: data.message };
                    }
                } catch (err) {
                    const error = err.response?.data?.message || "Signup failed. Please try again.";
                    set({ error, loading: false });
                    return { success: false, message: error };
                }
            },

            login: async (email, password) => {
                set({ loading: true, error: null });
                try {
                    const { data } = await axios.post("/login", { email, password });
                    if (data.success) {
                        set({
                            user: data.data,
                            isAuthenticated: true,
                            loading: false,
                        });
                        return { success: true };
                    } else {
                        set({ error: data.message, loading: false });
                        return { success: false, message: data.message };
                    }
                } catch (err) {
                    const error = err.response?.data?.message || "Login failed. Please try again.";
                    set({ error, loading: false });
                    return { success: false, message: error };
                }
            },

            logout: async () => {
                try {
                    await axios.post("/logout");
                    localStorage.removeItem("token");
                    set({ user: null, isAuthenticated: false });
                } catch (err) {
                    console.error("Logout error:", err);
                }
            },

            // Update user action
            updateUser: async (userData) => {
                set({ loading: true, error: null });
                try {
                    const res = await axios.put("/update-user", userData, {
                        withCredentials: true,
                    });

                    if (res.data.success) {
                        set({
                            user: res.data.data,
                            loading: false,
                        });
                    }
                    return res.data;
                } catch (err) {
                    const error = err.response?.data?.message || "Update failed";
                    set({ error, loading: false });
                    return { success: false, message: error };
                }
            },

            checkAuth: async () => {
                set({ loading: true });
                try {
                    const token = localStorage.getItem("token");

                    const { data } = await axios.get("/check-auth", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    });

                    if (data.success) {
                        set({ user: data.user, isAuthenticated: true, loading: false });
                        return true;
                    }
                } catch (err) {
                    set({ user: null, isAuthenticated: false, loading: false });
                }
                return false;
            },
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
        }
    )
);
