import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import JournalForm from "../components/JournalForm";
import {
  createJournal,
  getJournalById,
  updateJournal,
} from "../services/journalService";

function CreateJournal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({
    title: "",
    content: "",
    mood: "",
    tags: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) return;

    const loadJournal = async () => {
      try {
        const journal = await getJournalById(id);

        setForm({
          title: journal.title || "",
          content: journal.content || "",
          mood: journal.mood || "",
          tags: Array.isArray(journal.tags)
            ? journal.tags.join(", ")
            : "",
        });
      } catch {
        setError("Could not load this journal entry.");
      }
    };

    loadJournal();
  }, [id, isEditing]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setIsSaving(true);

    try {
      const payload = {
        ...form,
        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
          .slice(0, 8),
      };

      if (isEditing) {
        await updateJournal(id, payload);
      } else {
        await createJournal(payload);
      }

      navigate("/dashboard");
    } catch {
      setError(
        "Could not save this journal. Please check the fields and try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MainLayout>
      <JournalForm
        form={form}
        isEditing={isEditing}
        isSaving={isSaving}
        error={error}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </MainLayout>
  );
}

export default CreateJournal;
