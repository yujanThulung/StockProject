import React, { useEffect } from "react";
import useNotificationStore from "../../../store/notification.store";
import { FaTrashAlt } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";

const TriggeredNotifications = () => {
    const {
        notifications,
        fetchNotifications,
        deleteNotification,
        loading,
    } = useNotificationStore();

    useEffect(() => {
        fetchNotifications(true); 
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteNotification(id);
            toast.success("Notification removed successfully!");
        } catch (err) {
            toast.error("Failed to remove notification.");
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-8 bg-white rounded-2xl shadow-xl mt-12 border border-green-100">
            <Toaster position="top-right" />
            <h2 className="text-3xl font-bold mb-6 text-center text-green-800">
                ✅ Triggered Notifications
            </h2>

            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : notifications.length === 0 ? (
                <p className="text-center text-gray-500">No triggered notifications found.</p>
            ) : (
                <div className="space-y-6">
                    {notifications.map(({ _id, symbol, targetPrice, message }) => (
                        <div
                            key={_id}
                            className="flex justify-between items-center p-6 bg-green-50 rounded-lg shadow-md border border-green-200 hover:shadow-lg transition"
                        >
                            <div>
                                <p className="text-xl font-semibold text-green-800">{symbol}</p>
                                <p className="text-gray-700">
                                    Target Price: ${targetPrice.toFixed(2)}
                                    <span className="ml-2 text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                                        Triggered
                                    </span>
                                </p>
                                <p className="text-gray-600 italic">{message}</p>
                            </div>
                            <button
                                onClick={() => handleDelete(_id)}
                                title="Delete Notification"
                                className="text-red-600 hover:text-red-800 transition"
                            >
                                <FaTrashAlt size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TriggeredNotifications;
