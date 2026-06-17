import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/auth";

function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const token = searchParams.get("token");
  const username = searchParams.get("username");

  useEffect(() => {
    if (!token) {
      return;
    }

    const completeLogin = async () => {
      try {
        login(token, username || "Google user");
        navigate("/dashboard", { replace: true });
      } catch {
        setError("Google login failed. Please check backend OAuth configuration.");
      }
    };

    completeLogin();
  }, [login, navigate, token, username]);

  const visibleError = error || (!token ? "Google did not return a login token." : "");

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/70">
        <h1 className="text-2xl font-black text-slate-950">Completing Google login</h1>
        <p className="mt-3 text-slate-600">{visibleError || "Please wait while we sign you in."}</p>
      </div>
    </div>
  );
}

export default GoogleCallback;
