import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/auth";
import { getProfile, updateSentimentAnalysis } from "../services/userService";

const statCards = [
  { key: "totalJournals", label: "Total journals" },
  { key: "favoriteCount", label: "Favorites" },
  { key: "entriesThisWeek", label: "This week" },
];

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch {
        setError("Could not load profile details.");
      }
    };

    loadProfile();
  }, []);

  const handleToggleSentiment = async () => {
    if (!profile) return;
    const nextValue = !profile.sentimentAnalysis;
    setProfile((current) => ({ ...current, sentimentAnalysis: nextValue }));

    try {
      await updateSentimentAnalysis(nextValue);
    } catch {
      setProfile((current) => ({ ...current, sentimentAnalysis: !nextValue }));
      setError("Could not update sentiment analysis setting.");
    }
  };

  return (
    <MainLayout>
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">Account</p>
        <h1 className="mt-3 text-4xl font-black text-slate-950 dark:text-white sm:text-5xl">Profile</h1>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {statCards.map((stat) => (
            <div key={stat.key} className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-950">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{stat.label}</p>
              <p className="mt-2 text-3xl font-black text-slate-950 dark:text-white">
                {profile ? profile[stat.key] : "-"}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-950">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {profile?.email && profile?.username === profile.email ? "Account name" : "Username"}
            </p>
            <p className="mt-1 text-xl font-black text-slate-950 dark:text-white">
              {profile?.username || user?.username || "Signed-in user"}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-950">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Email</p>
            <p className="mt-1 break-words text-xl font-black text-slate-950 dark:text-white">
              {profile?.email || "Not added"}
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-5 dark:bg-slate-950">
            <div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Sentiment analysis</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Include your entries in weekly mood summary emails when sentiment labels are available.
              </p>
            </div>
            <button
              onClick={handleToggleSentiment}
              className={`rounded-xl px-4 py-2 text-sm font-bold text-white ${
                profile?.sentimentAnalysis ? "bg-emerald-700" : "bg-slate-500"
              }`}
            >
              {profile?.sentimentAnalysis ? "On" : "Off"}
            </button>
          </div>
        </div>
      </motion.section>
    </MainLayout>
  );
}

export default Profile;
