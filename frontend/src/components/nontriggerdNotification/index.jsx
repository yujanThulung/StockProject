import React, { useEffect, useState } from "react";
import useNotificationStore from "../../../store/notification.store";
import { FaTrashAlt, FaEdit, FaSave, FaTimes, FaPlus } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";

const NotificationManager = () => {
  const {
    notifications,
    loading,
    error,
    fetchNotifications,
    addNotification,
    updateNotification,
    deleteNotification,
  } = useNotificationStore();

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    symbol: "",
    targetPrice: "",
    message: "",
    condition: "gte",
  });

  const [editForm, setEditForm] = useState({
    targetPrice: "",
    message: "",
    condition: "gte",
    ticker: "",
  });

  useEffect(() => {
    fetchNotifications(false);
  }, []);

  const resetForm = () =>
    setForm({ symbol: "", targetPrice: "", message: "", condition: "gte" });

  const isSymbolValid = (symbol) => /^[A-Za-z]+$/.test(symbol);
  const isPriceValid = (price) => !isNaN(price) && parseFloat(price) > 0;

  const handleAdd = async () => {
    if (!form.symbol || !form.targetPrice) {
      toast.error("Please fill all fields");
      return;
    }

    if (!isSymbolValid(form.symbol)) {
      toast.error("Ticker Symbol should contain only letters.");
      return;
    }

    if (!isPriceValid(form.targetPrice)) {
      toast.error("Target Price must be a positive number.");
      return;
    }

    const symbolUpper = form.symbol.toUpperCase();
    const price = parseFloat(form.targetPrice);
    const defaultMessage = `${symbolUpper} has ${
      form.condition === "gte" ? "reached or exceeded" : "dropped below or equal to"
    } $${price}`;

    try {
      await addNotification({
        symbol: symbolUpper,
        targetPrice: price,
        message: form.message.trim() || defaultMessage,
        condition: form.condition,
      });
      toast.success("Notification created successfully!");
      resetForm();
    } catch (err) {
      toast.error("Failed to create notification.");
    }
  };

  const startEdit = (id, symbol, targetPrice, message, condition) => {
    setEditingId(id);
    setEditForm({
      targetPrice: targetPrice.toString(),
      message,
      condition,
      ticker: symbol,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ targetPrice: "", message: "", condition: "gte", ticker: "" });
  };

  const handleUpdate = async () => {
    const priceNum = parseFloat(editForm.targetPrice);

    if (!isPriceValid(priceNum)) {
      toast.error("Target Price must be a positive number.");
      return;
    }

    if (!editForm.message.trim()) {
      toast.error("Message cannot be empty.");
      return;
    }

    try {
      await updateNotification(editingId, {
        targetPrice: priceNum,
        message: editForm.message.trim(),
        condition: editForm.condition,
      });
      toast.success("Notification updated successfully!");
      cancelEdit();
    } catch (err) {
      toast.error("Failed to update notification.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      toast.success("Notification deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete notification.");
    }
  };

  return (
    <div className="max-w-full mx-auto p-8 bg-white rounded-2xl shadow-xl mt-12 border border-blue-100">
      <Toaster position="top-right" />
      <h2 className="text-4xl font-bold mb-8 text-center text-blue-800">
        📈 Price Alert Manager
      </h2>

      {!editingId && (
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center items-center">
          <input
            type="text"
            placeholder="Ticker Symbol (e.g. AAPL)"
            className="flex-1 px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.symbol}
            onChange={(e) => setForm({ ...form, symbol: e.target.value })}
          />
          <input
            type="number"
            placeholder="Target Price"
            className="w-40 px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.targetPrice}
            onChange={(e) => setForm({ ...form, targetPrice: e.target.value })}
          />
          <select
            className="w-40 px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.condition}
            onChange={(e) => setForm({ ...form, condition: e.target.value })}
          >
            <option value="gte">≥ Greater or Equal</option>
            <option value="lte">≤ Less or Equal</option>
          </select>
          <input
            type="text"
            placeholder="Optional message"
            className="flex-1 px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />

          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <FaPlus /> Add
          </button>
        </div>
      )}

      {editingId && (
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center items-center">
          <input
            type="text"
            value={editForm.ticker}
            disabled
            className="w-40 px-4 py-3 border rounded-lg shadow-sm bg-gray-100 text-gray-600 cursor-not-allowed"
          />
          <input
            type="number"
            placeholder="New Target Price"
            className="w-40 px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={editForm.targetPrice}
            onChange={(e) =>
              setEditForm({ ...editForm, targetPrice: e.target.value })
            }
          />
          <select
            className="w-40 px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={editForm.condition}
            onChange={(e) =>
              setEditForm({ ...editForm, condition: e.target.value })
            }
          >
            <option value="gte">≥ Greater or Equal</option>
            <option value="lte">≤ Less or Equal</option>
          </select>
          <input
            type="text"
            placeholder="New Message"
            className="flex-1 px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={editForm.message}
            onChange={(e) =>
              setEditForm({ ...editForm, message: e.target.value })
            }
          />
          <button
            onClick={handleUpdate}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
          >
            <FaSave /> Save
          </button>
          <button
            onClick={cancelEdit}
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition flex items-center gap-2"
          >
            <FaTimes /> Cancel
          </button>
        </div>
      )}

      <div className="space-y-6">
        {notifications.length === 0 && !loading ? (
          <p className="text-center text-gray-500 text-lg">
            No notifications yet. Add one above!
          </p>
        ) : (
          notifications
            .filter((n) => n.triggered === false)
            .map(({ _id, symbol, targetPrice, message, triggered, condition }) => (
              <div
                key={_id}
                className="flex justify-between items-center p-6 bg-blue-50 rounded-lg shadow-md border border-blue-200 hover:shadow-lg transition"
              >
                <div>
                  <p className="text-xl font-semibold text-blue-800">{symbol}</p>
                  <p className="text-gray-700">
                    Target Price: ${targetPrice.toFixed(2)} (
                    {condition === "gte" ? "≥" : "≤"})
                  </p>
                  <p className="text-gray-600 italic">{message}</p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() =>
                      startEdit(_id, symbol, targetPrice, message, condition)
                    }
                    title="Edit Alert"
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    <FaEdit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(_id)}
                    title="Delete Alert"
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <FaTrashAlt size={20} />
                  </button>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default NotificationManager;
