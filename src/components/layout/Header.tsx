import React, { useState } from "react";
import { Bell, X } from "lucide-react";
import { useUser } from "../../context/UserContext";
import { motion, AnimatePresence } from "framer-motion";

const Header: React.FC = () => {
  const {
    notifications,
    unreadNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useUser();
  const [showNotifications, setShowNotifications] = useState(false);

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <header className="fixed top-0 right-0 z-10 flex items-center justify-end h-16 px-6 text-white bg-transparent left-64">
      <div className="relative">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 transition-colors rounded-full bg-slate-700 hover:bg-slate-700"
        >
          <Bell className="w-6 h-6 " />
          {unreadNotifications > 0 && (
            <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs bg-red-500 rounded-full">
              {unreadNotifications}
            </span>
          )}
        </button>

        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 z-20 mt-2 overflow-hidden rounded-lg shadow-lg w-80 bg-slate-800"
            >
              <div className="flex items-center justify-between p-3">
                <h3 className="font-semibold">Notifications</h3>
                {notifications.length > 0 && (
                  <button
                    onClick={() => {
                      markAllNotificationsAsRead();
                      setShowNotifications(false);
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="overflow-y-auto max-h-96">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-slate-400">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3  ${
                        notification.read ? "bg-slate-800" : "bg-slate-700"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 ${getNotificationColor(
                            notification.type
                          )}`}
                        />
                        <div className="flex-1">
                          <p className="text-sm">{notification.message}</p>
                          <p className="mt-1 text-xs text-slate-400">
                            {new Date(notification.timestamp).toLocaleString()}
                          </p>
                        </div>
                        {!notification.read && (
                          <button
                            onClick={() =>
                              markNotificationAsRead(notification.id)
                            }
                            className="text-slate-400 hover:text-white"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
