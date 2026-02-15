import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markAsRead } from "./notificationSlice";
import { useEffect, useState } from "react";

export default function NotificationBell() {
  const dispatch = useDispatch<any>();
  const { items, unreadCount, page, hasMore } = useSelector(
    (state: any) => state.notifications
  );

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open && items.length === 0) {
        dispatch(fetchNotifications(1));
    }
  }, [open]);

  return (
    <div className="notification-wrapper">
      <button onClick={() => setOpen(!open)}>
        🔔 {unreadCount > 0 && <span>{unreadCount}</span>}
      </button>

      {open && (
        <div className="dropdown">
          {items.map((n: any) => (
            <div
              key={n.id}
              className={n.isRead ? "read" : "unread"}
              onClick={() => dispatch(markAsRead(n.id))}
            >
              {n.message}
            </div>
          ))}

          {hasMore && (
            <button onClick={() => dispatch(fetchNotifications(page))}>
              Load More
            </button>
          )}
        </div>
      )}
    </div>
  );
}
