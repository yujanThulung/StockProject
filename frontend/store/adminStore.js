import { create } from 'zustand';
import api from '../src/lib/axios.js';

const DEFAULT_LIMIT = 10;

const useAdminStore = create((set, get) => ({
  users: [],
  pagination: { total: 0, page: 1, limit: DEFAULT_LIMIT, totalPages: 1 },
  search: '',
  roleFilter: '',
  loading: false,
  error: null,

  // Fetch with current or overridden params
  fetchUsers: async ({ page, search, role } = {}) => {
    const state = get();
    const resolvedPage   = page   !== undefined ? page   : state.pagination.page;
    const resolvedSearch = search !== undefined ? search : state.search;
    const resolvedRole   = role   !== undefined ? role   : state.roleFilter;

    set({ loading: true, error: null });

    try {
      const params = new URLSearchParams({
        page:  resolvedPage,
        limit: DEFAULT_LIMIT,
        ...(resolvedSearch && { search: resolvedSearch }),
        ...(resolvedRole   && { role:   resolvedRole }),
      });

      const { data } = await api.get(`/admin/users?${params}`);

      set({
        users:      data.data,
        pagination: data.pagination,
        search:     resolvedSearch,
        roleFilter: resolvedRole,
        loading:    false,
      });
    } catch (err) {
      const error = err.response?.data?.message || 'Failed to fetch users';
      set({ error, loading: false });
    }
  },

  updateUserRole: async (id, role) => {
    try {
      const { data } = await api.patch(`/admin/users/${id}/role`, { role });
      set((state) => ({
        users: state.users.map((u) => (u._id === id ? { ...u, role: data.data.role } : u)),
      }));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to update role' };
    }
  },

  deleteUser: async (id) => {
    try {
      await api.delete(`/admin/users/${id}`);
      // Refetch current page so pagination stays accurate
      await get().fetchUsers();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to delete user' };
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAdminStore;
