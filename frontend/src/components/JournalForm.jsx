import { motion } from "framer-motion";

const moods = ["Calm", "Happy", "Focused", "Grateful", "Tired", "Anxious"];
const maxContentLength = 5000;

function JournalForm({
  form,
  isEditing = false,
  isSaving = false,
  error = "",
  onChange,
  onSubmit,
}) {
  const contentLength = form.content.length;
  const wordCount = form.content.trim() ? form.content.trim().split(/\s+/).length : 0;
  const tagText = Array.isArray(form.tags) ? form.tags.join(", ") : "";

  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-8"
    >
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
          {isEditing ? "Refine entry" : "New entry"}
        </p>
        <h1 className="mt-3 text-3xl font-black text-slate-950 dark:text-white sm:text-5xl">
          {isEditing ? "Edit Journal" : "Create Journal"}
        </h1>
      </div>

      {error ? (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {error}
        </div>
      ) : null}

      <label className="mb-5 block">
        <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Title</span>
        <input
          name="title"
          value={form.title}
          onChange={onChange}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-950"
          placeholder="A quiet win, a hard lesson, a bright idea..."
          required
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Mood</span>
        <div className="mb-5 flex flex-wrap gap-2">
          {moods.map((mood) => (
            <button
              key={mood}
              type="button"
              onClick={() => onChange({ target: { name: "mood", value: mood } })}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                form.mood === mood
                  ? "bg-indigo-700 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {mood}
            </button>
          ))}
        </div>
      </label>

      <label className="mb-5 block">
        <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Tags</span>
        <input
          name="tags"
          value={tagText}
          onChange={(event) =>
            onChange({
              target: {
                name: "tags",
                value: event.target.value
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean)
                  .slice(0, 8),
              },
            })
          }
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-950"
          placeholder="learning, gratitude, career"
        />
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Separate tags with commas. Maximum 8 tags.</p>
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Thoughts</span>
        <textarea
          name="content"
          value={form.content}
          onChange={onChange}
          rows="10"
          maxLength={maxContentLength}
          className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-950"
          placeholder="Write what happened, what mattered, and what you want to remember."
          required
        />
      </label>

      <div className="mt-3 flex flex-wrap justify-between gap-2 text-sm text-slate-500 dark:text-slate-400">
        <span>{wordCount} words</span>
        <span>{contentLength}/{maxContentLength} characters</span>
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-xl bg-indigo-700 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-70 dark:shadow-none"
        >
          {isSaving ? "Saving..." : isEditing ? "Update Journal" : "Save Journal"}
        </button>
      </div>
    </motion.form>
  );
}

export default JournalForm;
