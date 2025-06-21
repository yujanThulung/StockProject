// import { create } from "zustand";
// import axios from "axios";
// import { persist } from "zustand/middleware";

// export const useAuthStore = create(
//   persist(
//     (set, get) => ({
//       user: null,
//       loading: false,
//       error: null,
//       isAuthenticated: false,

//       // Signup action
//       signup: async (userData) => {
//         set({ loading: true, error: null });
//         try {
//           const { name, email, password, role } = userData;

//           const res = await axios.post("/api/signup", {
//             name,
//             email,
//             password,
//             role: role || "user",
//           });

//           if (res.data.success) {
//             set({
//               user: res.data.data,
//               isAuthenticated: true,
//               loading: false,
//             });
//           }
//           return res.data;
//         } catch (err) {
//           const error = err.response?.data?.message || "Signup failed";
//           set({ error, loading: false });
//           return { success: false, message: error };
//         }
//       },

//       // Login action
//       login: async (email, password) => {
//         set({ loading: true, error: null });
//         try {
//           const res = await axios.post(
//             "/api/login",
//             { email, password },
//             { withCredentials: true }
//           );

//           if (res.data.success) {
//             set({
//               user: res.data.data,
//               isAuthenticated: true,
//               loading: false,
//             });
//           }
//           return res.data;
//         } catch (err) {
//           const error = err.response?.data?.message || "Login failed";
//           set({ error, loading: false });
//           return { success: false, message: error };
//         }
//       },

//       // Logout action
//       logout: async () => {
//         set({ loading: true });
//         try {
//           const res = await axios.post("/api/logout", {}, { withCredentials: true });

//           if (res.data.success) {
//             set({
//               user: null,
//               isAuthenticated: false,
//               loading: false,
//             });
//           }
//           return res.data;
//         } catch (err) {
//           const error = err.response?.data?.message || "Logout failed";
//           set({ error, loading: false });
//           return { success: false, message: error };
//         }
//       },

//       // Update user action
//       updateUser: async (userData) => {
//         set({ loading: true, error: null });
//         try {
//           const res = await axios.put("/api/user", userData, {
//             withCredentials: true,
//           });

//           if (res.data.success) {
//             set({
//               user: res.data.data,
//               loading: false,
//             });
//           }
//           return res.data;
//         } catch (err) {
//           const error = err.response?.data?.message || "Update failed";
//           set({ error, loading: false });
//           return { success: false, message: error };
//         }
//       },

//       // Delete user action (admin only)
//       deleteUser: async (userIdToDelete) => {
//         set({ loading: true, error: null });
//         try {
//           const res = await axios.delete(`/api/user?userIdToDelete=${userIdToDelete}`, {
//             withCredentials: true,
//           });

//           return res.data;
//         } catch (err) {
//           const error = err.response?.data?.message || "Delete failed";
//           set({ error, loading: false });
//           return { success: false, message: error };
//         } finally {
//           set({ loading: false });
//         }
//       },

//       // Check auth status
//       checkAuth: async () => {
//         set({ loading: true });
//         try {
//           const res = await axios.get("/api/check-auth", {
//             withCredentials: true,
//           });

//           if (res.data.success) {
//             set({
//               user: res.data.user,
//               isAuthenticated: true,
//               loading: false,
//             });
//           } else {
//             set({
//               user: null,
//               isAuthenticated: false,
//               loading: false,
//             });
//           }
//           return res.data;
//         } catch (err) {
//           set({
//             user: null,
//             isAuthenticated: false,
//             loading: false,
//           });
//           return { success: false, message: "Not authenticated" };
//         }
//       },
//     }),
//     {
//       name: "auth-storage",
//       partialize: (state) => ({
//         user: state.user,
//         isAuthenticated: state.isAuthenticated
//       }),
//     }
//   )
// );

// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import axios from 'axios';

// // Configure axios defaults
// axios.defaults.withCredentials = true;
// axios.defaults.baseURL = 'http://localhost:8000/api';

// export const useAuthStore = create(
//   persist(
//     (set) => ({
//       user: null,
//       loading: false,
//       error: null,
//       isAuthenticated: false,

//       // Login action
//       login: async (email, password) => {
//         set({ loading: true, error: null });
//         try {
//           const { data } = await axios.post('/login', { email, password });

//           if (data.success) {
//             set({
//               user: data.data,
//               isAuthenticated: true,
//               loading: false,
//             });
//             return { success: true };
//           } else {
//             set({ error: data.message, loading: false });
//             return { success: false, message: data.message };
//           }
//         } catch (err) {
//           const error = err.response?.data?.message || "Login failed. Please try again.";
//           set({ error, loading: false });
//           return { success: false, message: error };
//         }
//       },

//       // Logout action
//       logout: async () => {
//         try {
//           await axios.post('/logout');
//           set({
//             user: null,
//             isAuthenticated: false,
//           });
//         } catch (err) {
//           console.error("Logout error:", err);
//         }
//       },

//       // Check auth status
//       checkAuth: async () => {
//         set({ loading: true });
//         try {
//           const { data } = await axios.get('/check-auth');
//           if (data.success) {
//             set({
//               user: data.user,
//               isAuthenticated: true,
//               loading: false,
//             });
//             return true;
//           }
//         } catch (err) {
//           set({
//             user: null,
//             isAuthenticated: false,
//             loading: false,
//           });
//         }
//         return false;
//       },
//     }),
//     {
//       name: 'auth-storage',
//       partialize: (state) => ({
//         user: state.user,
//         isAuthenticated: state.isAuthenticated
//       }),
//     }
//   )
// );

// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useAuthStore } from "../store/authStore";
// import axios from 'axios';

// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated, loading } = useAuthStore();

//   if (loading) return <div className="text-white">Loading...</div>;
//   if (!isAuthenticated) return <Navigate to="/login" replace />;

//   return children;
// };

// export default ProtectedRoute;

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
                        console.log("Login successful:", data);
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
                    const { data } = await axios.get("/check-auth");
                    if (data.success) {
                        set({ user: data.user, isAuthenticated: true, loading: false });
                        return true;
                    }
                } catch {
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
