import React, { useState } from 'react';
import { FaPlus, FaTrashAlt, FaEdit, FaCheck, FaTimes, FaBell, FaChartLine } from 'react-icons/fa';

const AlertManager = () => {
  const [alerts, setAlerts] = useState([]);
//   const [alerts, setAlerts] = useState([
//   { id: 1, symbol: 'AAPL', targetPrice: 195.5 },
//   { id: 2, symbol: 'TSLA', targetPrice: 725.0 }
// ]);

  const [symbol, setSymbol] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [editingId, setEditingId] = useState(null);

  const handleAddAlert = () => {
    if (!symbol || !targetPrice) return;
    const newAlert = {
      id: Date.now(),
      symbol: symbol.toUpperCase(),
      targetPrice: parseFloat(targetPrice)
    };
    setAlerts([...alerts, newAlert]);
    setSymbol('');
    setTargetPrice('');
  };

  const handleDelete = (id) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const handleEdit = (id) => {
    const alert = alerts.find(a => a.id === id);
    setSymbol(alert.symbol);
    setTargetPrice(alert.targetPrice);
    setEditingId(id);
  };

  const handleUpdate = () => {
    setAlerts(alerts.map(alert =>
      alert.id === editingId
        ? { ...alert, symbol: symbol.toUpperCase(), targetPrice: parseFloat(targetPrice) }
        : alert
    ));
    setSymbol('');
    setTargetPrice('');
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setSymbol('');
    setTargetPrice('');
    setEditingId(null);
  };

  return (
    <div className="max-w-full mx-auto p-6 mt-10 bg-slate-50-50 rounded-2xl shadow-lg border border-blue-100">
      <div className="flex items-center mb-6">
        <div className="bg-blue-500 p-3 rounded-xl text-white shadow-md mr-3">
          <FaBell className="text-xl" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Price Alert Tracker</h2>
          <p className="text-sm text-gray-600">Get notified when your targets are hit</p>
        </div>
      </div>

      <div className="flex items-end gap-3 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Ticker Symbol</label>
          <input
            type="text"
            placeholder="e.g. AAPL"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
          />
        </div>
        <div className="w-32">
          <label className="block text-sm font-medium text-gray-700 mb-1">Target Price</label>
          <input
            type="number"
            placeholder="$0.00"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
          />
        </div>
        {editingId ? (
          <div className="flex gap-2 mb-1">
            <button 
              onClick={handleUpdate} 
              className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow transition"
            >
              <FaCheck />
            </button>
            <button 
              onClick={handleCancelEdit} 
              className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow transition"
            >
              <FaTimes />
            </button>
          </div>
        ) : (
          <button 
            onClick={handleAddAlert} 
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition mb-1 flex items-center justify-center"
          >
            <FaPlus />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-xl shadow-sm border border-gray-200">
            <FaChartLine className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-sm font-medium text-gray-900">No alerts yet</h3>
            <p className="mt-1 text-sm text-gray-500">Add your first price alert to get started</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-200">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg mr-3 text-blue-600">
                  <FaChartLine />
                </div>
                <div>
                  <span className="font-bold text-blue-700">{alert.symbol}</span>
                  <span className="text-gray-500 mx-2">→</span>
                  <span className="font-semibold text-gray-900">${alert.targetPrice.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(alert.id)} 
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition"
                  aria-label="Edit"
                >
                  <FaEdit />
                </button>
                <button 
                  onClick={() => handleDelete(alert.id)} 
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition"
                  aria-label="Delete"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertManager;