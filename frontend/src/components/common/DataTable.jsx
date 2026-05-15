import { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, X } from 'lucide-react';

/**
 * Reusable paginated table component.
 *
 * Supports two pagination modes:
 *
 * CLIENT-SIDE (default):
 *   Pass `data` with all rows. DataTable handles search, filter, and pagination internally.
 *   Props: searchable, searchPlaceholder, searchKeys, filters, toolbar, pageSize
 *
 * SERVER-SIDE:
 *   Pass `pagination` + `onPageChange`. DataTable renders the pagination UI only.
 *   Search/filter are handled by the parent and should NOT be passed here.
 *   Props: pagination { total, page, limit, totalPages }, onPageChange(page)
 *
 * Common props:
 *   columns      {Array}    { key, label, render?(row), className?, headerClassName? }
 *   data         {Array}    Row objects (current page only in server mode).
 *   keyField     {string}   Field used as React key.
 *   loading      {boolean}  Shows loading row.
 *   emptyMessage {string}   Empty state text.
 */
const DataTable = ({
  // Core
  columns,
  data,
  keyField,
  loading = false,
  emptyMessage = 'No data found',

  // Client-side mode
  pageSize = 10,
  searchable = false,
  searchPlaceholder = 'Search...',
  searchKeys,
  filters,
  toolbar,

  // Server-side mode
  pagination,
  onPageChange,
}) => {
  const isServerMode = Boolean(pagination && onPageChange);

  // Client-side state (unused in server mode)
  const [clientPage, setClientPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({});

  const hasSearch  = !isServerMode && searchable;
  const hasFilters = !isServerMode && filters && filters.length > 0;
  const showControls = hasSearch || hasFilters || toolbar;

  // Client-side search
  const afterSearch = useMemo(() => {
    if (!hasSearch || !searchQuery.trim()) return data;
    const q = searchQuery.toLowerCase();
    return data.filter((row) => {
      const keys = searchKeys || Object.keys(row).filter((k) => typeof row[k] === 'string');
      return keys.some((k) => String(row[k] ?? '').toLowerCase().includes(q));
    });
  }, [data, searchQuery, hasSearch, searchKeys]);

  // Client-side filter
  const afterFilters = useMemo(() => {
    if (!hasFilters) return afterSearch;
    return afterSearch.filter((row) =>
      Object.entries(activeFilters).every(([key, value]) => {
        if (!value) return true;
        return String(row[key]) === String(value);
      })
    );
  }, [afterSearch, activeFilters, hasFilters]);

  // Pagination values
  const clientTotalPages = Math.max(1, Math.ceil(afterFilters.length / pageSize));
  const clientSafePage   = Math.min(clientPage, clientTotalPages);
  const paginated = isServerMode
    ? data
    : afterFilters.slice((clientSafePage - 1) * pageSize, clientSafePage * pageSize);

  const displayPage       = isServerMode ? pagination.page       : clientSafePage;
  const displayTotalPages = isServerMode ? pagination.totalPages  : clientTotalPages;
  const displayTotal      = isServerMode ? pagination.total       : afterFilters.length;

  const handleClientSearch = (e) => { setSearchQuery(e.target.value); setClientPage(1); };
  const handleClientFilter = (key, value) => { setActiveFilters((p) => ({ ...p, [key]: value })); setClientPage(1); };
  const clearClientSearch  = () => { setSearchQuery(''); setClientPage(1); };

  const handlePrev = () => isServerMode ? onPageChange(pagination.page - 1) : setClientPage((p) => p - 1);
  const handleNext = () => isServerMode ? onPageChange(pagination.page + 1) : setClientPage((p) => p + 1);

  const colSpan = columns.length;

  return (
    <div>
      {/* Client-side controls row */}
      {showControls && (
        <div className="flex flex-wrap items-center justify-end gap-3 mb-3">
          {hasSearch && (
            <div className="relative min-w-[220px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleClientSearch}
                placeholder={searchPlaceholder}
                className="w-full pl-8 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
              {searchQuery && (
                <button onClick={clearClientSearch} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={13} />
                </button>
              )}
            </div>
          )}
          {hasFilters && filters.map((filter) => (
            <select
              key={filter.key}
              value={activeFilters[filter.key] || ''}
              onChange={(e) => handleClientFilter(filter.key, e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              <option value="">{filter.label}</option>
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ))}
          {toolbar}
        </div>
      )}

      {/* Table card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-300 border-b border-gray-200">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`text-left px-6 py-3 text-gray-900 font-medium ${col.headerClassName || ''}`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && paginated.length === 0 ? (
                <tr>
                  <td colSpan={colSpan} className="px-6 py-12 text-center text-gray-400">Loading...</td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={colSpan} className="px-6 py-12 text-center text-gray-400">{emptyMessage}</td>
                </tr>
              ) : (
                paginated.map((row) => (
                  <tr key={row[keyField]} className="hover:bg-gray-50 transition-colors">
                    {columns.map((col) => (
                      <td key={col.key} className={`px-6 py-4 ${col.className || ''}`}>
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        {displayTotal > 0 && (
          <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {displayTotal} result{displayTotal !== 1 ? 's' : ''}
              <span className="mx-1.5 text-gray-300">·</span>
              page {displayPage} of {displayTotalPages}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={displayPage <= 1}
                onClick={handlePrev}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg border border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <span className="px-2.5 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded-lg min-w-[2rem] text-center">
                {displayPage}
              </span>
              <button
                disabled={displayPage >= displayTotalPages}
                onClick={handleNext}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg border border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;
