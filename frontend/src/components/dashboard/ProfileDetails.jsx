import React, { useState } from "react";
import { useAuthStore } from "../../../store/authentication.store";
import { User, Mail, Lock, Settings, Key, X, Check } from "lucide-react";

const Toast = ({ message, type, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
  
  return (
    <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg ${bgColor} flex items-center justify-between min-w-[250px] z-50`}>
      <div className="flex items-center">
        {type === 'success' ? (
          <Check className="mr-2" size={18} />
        ) : (
          <X className="mr-2" size={18} />
        )}
        <span>{message}</span>
      </div>
      <button onClick={onClose} className="ml-4">
        <X size={16} />
      </button>
    </div>
  );
};

const ProfileDetails = ({ user, onClose }) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        password: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    const { updateUser } = useAuthStore();

    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ ...toast, show: false }), 3000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            showToast("New passwords don't match", 'error');
            return;
        }

        try {
            const updateData = {
                name: formData.name,
                email: formData.email,
                ...(formData.newPassword && { 
                    currentPassword: formData.password,
                    newPassword: formData.newPassword 
                })
            };

            const res = await updateUser(updateData);
            
            if (res.success) {
                showToast("Profile updated successfully", 'success');
                setTimeout(() => {
                    setIsEditing(false);
                    setActiveTab('profile');
                }, 1500);
            } else {
                showToast(res.message || "Update failed", 'error');
            }
        } catch (err) {
            showToast("An error occurred during update", 'error');
        }
    };

    return (
        <>
            {toast.show && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast({ ...toast, show: false })} 
                />
            )}

            <div className="w-80 bg-white overflow-hidden">
                <div className="border-b border-gray-200 flex">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`flex-1 py-3 text-sm font-medium flex items-center justify-center space-x-2 ${activeTab === 'profile' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <User size={16} />
                        <span>Profile</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`flex-1 py-3 text-sm font-medium flex items-center justify-center space-x-2 ${activeTab === 'security' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Key size={16} />
                        <span>Security</span>
                    </button>
                </div>

                <div className="p-4">
                    {activeTab === 'profile' ? (
                        isEditing ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                                        required
                                    />
                                </div>

                                <div className="flex justify-end space-x-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-md"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md"
                                    >
                                        Save Profile
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                                        <User size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Name</p>
                                        <p className="text-sm font-medium">{user?.name}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                                        <Mail size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Email</p>
                                        <p className="text-sm font-medium">{user?.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                                        <Settings size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Role</p>
                                        <p className="text-sm font-medium capitalize">{user?.role}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="w-full py-2 bg-blue-600 text-white text-sm rounded-md mt-4"
                                >
                                    Edit Profile
                                </button>
                            </div>
                        )
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Current Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                                    placeholder="Enter current password"
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-gray-500 mb-1">New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                                    placeholder="Enter new password"
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                                    placeholder="Confirm new password"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-2 bg-blue-600 text-white text-sm rounded-md mt-2"
                            >
                                Update Password
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProfileDetails;