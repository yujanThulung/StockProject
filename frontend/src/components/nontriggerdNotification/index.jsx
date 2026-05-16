import { useEffect, useState } from "react";
import useNotificationStore from "../../../store/notification.store";
import { Toaster, toast } from "react-hot-toast";
import Loader from "../common/Loader";
import EmptyState from "../common/EmptyState";
import {
  Bell,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { FiBell } from "react-icons/fi";

const conditionLabel = (c) => (c === "gte" ? "≥" : "≤");
const conditionText  = (c) => (c === "gte" ? "rises to or above" : "drops to or below");

// ─── Add / Edit form ──────────────────────────────────────────────────────────
const AlertForm = ({ initial, onSubmit, onCancel, submitLabel }) => {
  const [form, setForm] = useState(
    initial ?? { symbol: "", targetPrice: "", condition: "gte", message: "" }
  );

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.symbol.trim() || !form.targetPrice) {
      toast.error("Ticker and target price are required.");
      return;
    }
    if (!/^[A-Za-z]+$/.test(form.symbol)) {
      toast.error("Ticker must contain only letters.");
      return;
    }
    const price = parseFloat(form.targetPrice);
    if (isNaN(price) || price <= 0) {
      toast.error("Target price must be a positive number.");
      return;
    }
    const sym = form.symbol.toUpperCase();
    onSubmit({
      symbol: sym,
      targetPrice: price,
      condition: form.condition,
      message:
        form.message.trim() ||
        `${sym} ${conditionText(form.condition)} $${price}`,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Ticker</label>
          <input
            type="text"
            placeholder="e.g. AAPL"
            value={form.symbol}
            onChange={(e) => set("symbol", e.target.value)}
            disabled={!!initial}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Target Price</label>
          <input
            type="number"
            placeholder="e.g. 200"
            value={form.targetPrice}
            onChange={(e) => set("targetPrice", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Condition</label>
          <select
            value={form.condition}
            onChange={(e) => set("condition", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="gte">≥ Greater or Equal</option>
            <option value="lte">≤ Less or Equal</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Message (optional)</label>
          <input
            type="text"
            placeholder="Custom alert message"
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          type="submit"
          className="flex items-center gap-1.5 bg-blue-950 hover:bg-blue-900 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Check className="w-3.5 h-3.5" />
          {submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1.5 border border-gray-200 text-gray-600 hover:bg-gray-100 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

// ─── Alert row ────────────────────────────────────────────────────────────────
const AlertRow = ({ alert, onEdit, onDelete }) => {
  const { _id, symbol, targetPrice, message, condition } = alert;
  const isGte = condition === "gte";

  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        {/* Symbol badge */}
        <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 rounded px-2 py-0.5 flex-shrink-0">
          {symbol}
        </span>

        {/* Condition icon */}
        <span className={`flex-shrink-0 ${isGte ? "text-emerald-500" : "text-red-500"}`}>
          {isGte
            ? <TrendingUp className="w-3.5 h-3.5" />
            : <TrendingDown className="w-3.5 h-3.5" />}
        </span>

        {/* Price + condition */}
        <span className="text-sm font-semibold text-gray-800 flex-shrink-0">
          {conditionLabel(condition)} ${targetPrice.toFixed(2)}
        </span>

        {/* Message */}
        <span className="text-xs text-gray-400 truncate hidden sm:block">{message}</span>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0 ml-3">
        <button
          onClick={() => onEdit(alert)}
          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Edit alert"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDelete(_id)}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete alert"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const NotificationManager = () => {
  const {
    notifications,
    loading,
    fetchNotifications,
    addNotification,
    updateNotification,
    deleteNotification,
  } = useNotificationStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAlert, setEditingAlert]   = useState(null);

  useEffect(() => {
    fetchNotifications(false);
  }, []);

  const activeAlerts = notifications.filter((n) => !n.triggered);

  const handleAdd = async (data) => {
    try {
      await addNotification(data);
      toast.success("Alert created.");
      setShowAddForm(false);
    } catch {
      toast.error("Failed to create alert.");
    }
  };

  const handleUpdate = async (data) => {
    try {
      await updateNotification(editingAlert._id, data);
      toast.success("Alert updated.");
      setEditingAlert(null);
    } catch {
      toast.error("Failed to update alert.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      toast.success("Alert deleted.");
    } catch {
      toast.error("Failed to delete alert.");
    }
  };

  return (
    <div className="w-full p-4 space-y-4">
      <Toaster position="top-right" />

      {/* Header card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-gray-900">Price Alerts</h1>
            <p className="text-xs text-gray-400">
              {activeAlerts.length} active alert{activeAlerts.length !== 1 ? "s" : ""}
            </p>
          </div>

          {!showAddForm && !editingAlert && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1.5 bg-blue-950 hover:bg-blue-900 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              New Alert
            </button>
          )}
        </div>

        {/* Add form */}
        {showAddForm && !editingAlert && (
          <div className="mt-4">
            <AlertForm
              onSubmit={handleAdd}
              onCancel={() => setShowAddForm(false)}
              submitLabel="Create Alert"
            />
          </div>
        )}
      </div>

      {/* Edit form */}
      {editingAlert && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Editing alert — {editingAlert.symbol}
          </p>
          <AlertForm
            initial={{
              symbol: editingAlert.symbol,
              targetPrice: editingAlert.targetPrice.toString(),
              condition: editingAlert.condition,
              message: editingAlert.message,
            }}
            onSubmit={handleUpdate}
            onCancel={() => setEditingAlert(null)}
            submitLabel="Save Changes"
          />
        </div>
      )}

      {/* Alerts list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Active Alerts
        </p>

        {loading ? (
          <Loader text="Loading alerts..." />
        ) : activeAlerts.length === 0 ? (
          <EmptyState
            icon={FiBell}
            title="No active alerts"
            description="Create a price alert above to start monitoring stock prices."
          />
        ) : (
          <div className="space-y-2">
            {activeAlerts.map((alert) => (
              <AlertRow
                key={alert._id}
                alert={alert}
                onEdit={setEditingAlert}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationManager;
