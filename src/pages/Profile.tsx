import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import client from "../api/client";

interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string | number;
}

export default function Profile() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const userId = user?.nameid || user?.sub;
      if (!userId) return;

      try {
        const res = await client.get(`/user/${userId}`);
        setUserData(res.data);
        setFirstName(res.data.firstName);
        setLastName(res.data.lastName);
      } catch (err) {
        console.error("Fout bij ophalen profiel:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const userId = user?.nameid || user?.sub;
      await client.put(`/user/${userId}`, {
        firstName,
        lastName,
      });

      setMessage({
        type: "success",
        text: "Je profiel is succesvol bijgewerkt!",
      });
    } catch (err: any) {
      setMessage({
        type: "error",
        text:
          err.response?.data?.error ||
          "Bijwerken mislukt. Controleer je backend.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-20 text-slate-500 animate-pulse font-bold">
        Profiel laden...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 bg-slate-900 p-8 text-white flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center text-3xl font-black mb-4 shadow-lg shadow-blue-500/20">
              {firstName[0]}
              {lastName[0]}
            </div>
            <h2 className="text-xl font-bold">
              {firstName} {lastName}
            </h2>
            <p className="text-slate-400 text-sm mb-6">{userData?.email}</p>
          </div>

          <div className="md:w-2/3 p-8 md:p-12">
            <h1 className="text-2xl font-black text-slate-900 mb-2">
              Profiel instellingen
            </h1>
            <p className="text-slate-500 mb-8 font-medium">
              Beheer je persoonlijke gegevens en hoe je verschijnt op Arclight.
            </p>

            {message && (
              <div
                className={`mb-8 p-4 rounded-2xl font-bold animate-in fade-in slide-in-from-top-2 ${
                  message.type === "success"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {message.type === "success" ? "✅ " : "⚠️ "}
                {message.text}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                    Voornaam
                  </label>
                  <input
                    type="text"
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-800"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                    Achternaam
                  </label>
                  <input
                    type="text"
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-800"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                  E-mailadres (Niet aanpasbaar)
                </label>
                <input
                  type="email"
                  className="w-full px-5 py-3.5 rounded-2xl bg-slate-100 border-2 border-transparent text-slate-500 cursor-not-allowed outline-none font-bold"
                  value={userData?.email}
                  disabled
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
                >
                  {saving ? "Opslaan..." : "Wijzigingen opslaan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
