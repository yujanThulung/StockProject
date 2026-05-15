import { useEffect, useCallback, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import useAdminStore from '../../../store/adminStore.js';
import { useAuthStore } from '../../../store/authentication.store.js';
import DataTable from '../../components/common/DataTable.jsx';
import useQueryParams from '../../hooks/useQueryParams.js';
import Loader from '../../components/common/Loader.jsx';

const ROLES = ['user', 'admin'];

const UserManagement = () => {
  const {
    users, pagination, loading, error,
    fetchUsers, updateUserRole, deleteUser, clearError,
  } = useAdminStore();
  const currentUser = useAuthStore((state) => state.user);

  const { params, updateParams } = useQueryParams();
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const debounceRef = useRef(null);

  // Read state from URL params
  const search     = params.get('search') || '';
  const roleFilter = params.get('role')   || '';
  const page       = parseInt(params.get('page') || '1', 10);

  // Fetch whenever URL params change
  useEffect(() => {
    fetchUsers({ page, search, role: roleFilter });
  }, [search, roleFilter, page]);

  // Debounced search input — updates URL, which triggers fetch via effect
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateParams({ search: value, page: null });
    }, 400);
  }, [updateParams]);

  const clearSearch = () => updateParams({ search: null, page: null });

  const handleRoleFilterChange = (e) => {
    updateParams({ role: e.target.value || null, page: null });
  };

  const handlePageChange = (newPage) => {
    updateParams({ page: newPage });
  };

  const handleRoleChange = async (id, newRole) => {
    setActionLoading(id);
    const result = await updateUserRole(id, newRole);
    setActionLoading(null);
    if (!result.success) alert(result.message);
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    setActionLoading(confirmDelete);
    const result = await deleteUser(confirmDelete);
    setActionLoading(null);
    setConfirmDelete(null);
    if (!result.success) alert(result.message);
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (row) => {
        const isSelf = row._id === currentUser?.id;
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-xs uppercase flex-shrink-0">
              {row.name?.charAt(0)}
            </div>
            <span className="font-medium text-gray-800">
              {row.name}
              {isSelf && <span className="ml-2 text-xs text-gray-400">(you)</span>}
            </span>
          </div>
        );
      },
    },
    {
      key: 'email',
      label: 'Email',
      className: 'text-gray-600',
    },
    {
      key: 'role',
      label: 'Role',
      render: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
          }`}
        >
          {row.role}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Joined',
      className: 'text-gray-500',
      render: (row) =>
        new Date(row.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
    },
    {
      key: 'actions',
      label: '',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (row) => {
        const isSelf   = row._id === currentUser?.id;
        const isActing = actionLoading === row._id;
        return (
          <div className="flex items-center justify-end gap-2">
            <select
              value={row.role}
              disabled={isSelf || isActing}
              onChange={(e) => handleRoleChange(row._id, e.target.value)}
              className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <button
              disabled={isSelf || isActing}
              onClick={() => setConfirmDelete(row._id)}
              className="text-xs px-3 py-1 rounded-md border border-red-200 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isActing ? '...' : 'Delete'}
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <p className="text-sm text-gray-500 mt-1">
          {pagination.total} user{pagination.total !== 1 ? 's' : ''}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex justify-between items-center">
          <span className="text-red-600 text-sm">{error}</span>
          <button onClick={clearError} className="text-red-400 hover:text-red-600 text-lg leading-none">
            &times;
          </button>
        </div>
      )}

      {/* Search & filter — above table, right-aligned */}
      <div className="flex flex-wrap items-center justify-end gap-3 mb-3">
        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            defaultValue={search}
            onChange={handleSearchChange}
            placeholder="Search by name or email..."
            className="w-full pl-8 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          {search && (
            <button
              onClick={clearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Role filter */}
        <select
          value={roleFilter}
          onChange={handleRoleFilterChange}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        >
          <option value="">All roles</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="relative">
        {loading && users.length > 0 && <Loader overlay text="Updating..." />}
        <DataTable
          columns={columns}
          data={users}
          keyField="_id"
          loading={loading && users.length === 0}
          emptyMessage="No users found"
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Delete User</h2>
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone. The user will be permanently removed.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
