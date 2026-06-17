import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import MainLayout from "../layouts/MainLayout";

function Home() {
  return (
    <MainLayout>
      <section className="grid min-h-[72vh] items-center gap-10 lg:grid-cols-[1fr_0.82fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-700">
            Private journal
          </p>
          <h1 className="mt-4 max-w-4xl text-5xl font-black leading-tight text-slate-950 dark:text-white sm:text-7xl">
            Journal Application
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Capture your thoughts, revisit your days, and keep each entry safely behind your account.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/register"
              className="rounded-xl bg-gradient-to-r from-violet-700 to-fuchsia-600 px-6 py-3 font-bold text-white shadow-lg shadow-fuchsia-200 transition hover:-translate-y-0.5"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Login
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.12, duration: 0.35 }}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
        >
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-5 text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
            <p className="text-sm font-bold text-fuchsia-700">Today</p>
            <h2 className="mt-3 text-2xl font-black">Small notes, big memory</h2>
            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
              I made space to write before the day got loud. The smallest note ended up being the one I needed most.
            </p>
            <div className="mt-6 h-2 rounded-full bg-gradient-to-r from-violet-600 to-pink-500" />
          </div>
        </motion.div>
      </section>
    </MainLayout>
  );
}

export default Home;
