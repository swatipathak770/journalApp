import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function JournalCard({ entry, onDelete, onToggleFavorite }) {
  const entryId = entry.id;
  const preview =
    entry.content?.length > 180 ? `${entry.content.slice(0, 180).trim()}...` : entry.content;
  const dateLabel = entry.date
    ? new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(
        new Date(entry.date),
      )
    : "No date";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      whileHover={{ y: -4 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg hover:shadow-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-none"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-400">
            {dateLabel}
          </p>
          <h2 className="mt-3 text-2xl font-black text-slate-950 dark:text-white">{entry.title}</h2>
        </div>
        <button
          onClick={() => onToggleFavorite(entry)}
          className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
            entry.favorite
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
          }`}
        >
          {entry.favorite ? "Favorite" : "Save"}
        </button>
      </div>

      <p className="min-h-20 text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">{preview}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {entry.mood ? (
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200">
            {entry.mood}
          </span>
        ) : null}
        {entry.tags?.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to={`/journals/${entryId}/edit`}
          className="rounded-lg bg-indigo-50 px-5 py-2 text-sm font-bold text-indigo-700 transition hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-200"
        >
          Edit
        </Link>
        <button
          onClick={() => onDelete(entryId)}
          className="rounded-lg border border-slate-200 px-5 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Delete
        </button>
      </div>
    </motion.article>
  );
}

export default JournalCard;
