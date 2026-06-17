import { NavLink } from "react-router-dom";

const items = [
  { to: "/dashboard", label: "All journals" },
  { to: "/journals/new", label: "New entry" },
  { to: "/profile", label: "Profile" },
  { to: "/settings", label: "Settings" },
];

function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white px-4 py-6 dark:border-slate-800 dark:bg-slate-950 lg:block">
      <div className="mb-8 rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-400">
          Workspace
        </p>
        <h2 className="mt-2 font-black text-slate-950 dark:text-white">Personal Journal</h2>
      </div>

      <nav className="space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
