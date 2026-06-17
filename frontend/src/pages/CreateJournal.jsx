import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import JournalForm from "../components/JournalForm";
import { createJournal, getJournalById, updateJournal } from "../services/journalService";

function CreateJournal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [form, setForm] = useState({ title: "", content: "", mood: "", tags: [] });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    const loadJournal = async () => {
      try {
        const journal = await getJournalById(id);
        setForm({
          title: journal.title || "",
          content: journal.content || "",
          mood: journal.mood || "",
          tags: journal.tags || [],
        });
      } catch {
        setError("Could not load this journal entry.");
      }
    };

    loadJournal();
  }, [id, isEditing]);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      if (isEditing) {
        await updateJournal(id, form);
      } else {
        await createJournal(form);
      }

      navigate("/dashboard");
    } catch {
      setError("Could not save this journal. Please check the fields and try again.");
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
