import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useNotificationStore } from '../store/notificationStore';

const socket = io('http://localhost:8000', { withCredentials: true });

const useNotificationSocket = (userId) => {
  const addNotification = useNotificationStore((state) => state.addNotification);

  useEffect(() => {
    if (!userId) return;

    socket.emit('join', userId); // Backend can use this to target user rooms

    socket.on('price-alert', (data) => {
      console.log("🔔 Notification received:", data);
      addNotification(data);
    });

    return () => {
      socket.off('price-alert');
    };
  }, [userId]);

  return socket;
};

export default useNotificationSocket;
