import { motion } from "framer-motion";
import MainLayout from "../layouts/MainLayout";
import { useTheme } from "../context/theme";

function Settings() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <MainLayout>
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
          Preferences
        </p>
        <h1 className="mt-3 text-4xl font-black text-slate-950 dark:text-white">Settings</h1>

        <div className="mt-8 flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-5 dark:bg-slate-950">
          <div>
            <h2 className="font-black text-slate-950 dark:text-white">Dark mode</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Switch the journal workspace between light and dark themes.
            </p>
          </div>
          <button
            onClick={toggleDarkMode}
            className="rounded-xl bg-indigo-700 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-800"
          >
            {darkMode ? "Light" : "Dark"}
          </button>
        </div>
      </motion.section>
    </MainLayout>
  );
}

export default Settings;
