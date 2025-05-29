import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  FaChevronDown, FaChevronRight,
  FaUsers, FaClipboardList, FaBell, FaCalendarAlt, FaCreditCard,
  FaTachometerAlt, FaBuilding, FaComments
} from "react-icons/fa";

const SidebarSection = ({ title, icon, links }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="sidebar-section mb-2">
      <button className="sidebar-title" onClick={() => setOpen(!open)}>
        <span className="icon mr-2">{icon}</span>
        <span className="flex-1 text-left">{title}</span>
        {open ? <FaChevronDown /> : <FaChevronRight />}
      </button>
      {open && (
        <ul className="sidebar-links ml-4 mt-1">
          {links.map(({ to, label }) => (
            <li key={to} className="mb-1">
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `block px-2 py-1 rounded transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-700"
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Sidebar = ({ user }) => {
  return (
    <aside className="sidebar bg-gray-900 text-white w-64 min-h-screen p-4 fixed">
      <h2 className="text-xl font-bold mb-4 text-center border-b border-gray-700 pb-2">🏆 Sports Club</h2>

      <SidebarSection
        title="Club Dashboard"
        icon={<FaTachometerAlt />}
        links={[
          { to: "/dashboard", label: "Dashboard" },
          { to: "/profile", label: "Profile" },
          { to: "/membership", label: "Membership" },
          ...(user?.role === 'admin' ? [{ to: "/register", label: "Register" }] : [])
        ]}
      />

      <SidebarSection
        title="Club Events"
        icon={<FaCalendarAlt />}
        links={[
          { to: "/admin/events", label: "Admin Events" },
          { to: "/events", label: "Events" },
          { to: "/my-events", label: "My Events" },
          { to: "/calendar", label: "Calendar" },
        ]}
      />

      <SidebarSection
        title="Notifications"
        icon={<FaBell />}
        links={[
          { to: "/announcements", label: "Announcements" },
          { to: "/admin/announcements/new", label: "New Announcement" },
        ]}
      />

      <SidebarSection
        title="Teams"
        icon={<FaUsers />}
        links={[{ to: "/teams", label: "All Teams" }]}
      />

      <SidebarSection
        title="Facilities"
        icon={<FaBuilding />}
        links={[
          { to: "/facilities/manage", label: "Manage Facilities" },
          { to: "/facilities/book", label: "Book Facilities" },
          { to: "/facilities/my-bookings", label: "My Bookings" },
        ]}
      />

      <SidebarSection
        title="Payments"
        icon={<FaCreditCard />}
        links={[
          { to: "/receipts", label: "My Receipts" },
          ...(user?.role === "admin" ? [{ to: "/admin/payments", label: "All Payments" }] : []),
        ]}
      />

      <SidebarSection
        title="Community Forum"
        icon={<FaComments />}
        links={[
          { to: "/forum", label: "Forum Home" },
          { to: "/forum/create", label: "Create Post" }
        ]}
      />
    </aside>
  );
};

export default Sidebar;
