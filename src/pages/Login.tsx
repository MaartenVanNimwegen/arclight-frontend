import { useState } from "react";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      if (isRegistering) {
        // Register flow
        await authService.register({ email, firstName, lastName, password });

        setSuccessMessage("Account succesvol aangemaakt! Log hieronder in.");
        setIsRegistering(false);
        setPassword("");
      } else {
        // Login flow
        const response = await authService.login(email, password);

        if (response?.token) {
          login(response.token);
          navigate("/");
        }
      }
    } catch (err: any) {
      console.error("Auth error:", err);

      const errorDetail =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Er is een onbekende fout opgetreden.";

      setErrorMessage(errorDetail);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setErrorMessage("");
    setSuccessMessage("");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-50/50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-slate-200/60 border border-slate-100 p-8 transition-all duration-300">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
            <span className="text-3xl font-black italic">A</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            {isRegistering ? "Nieuw account" : "Welkom terug"}
          </h2>
          <p className="text-slate-500 mt-2 font-medium">
            {isRegistering
              ? "Maak deel uit van de community"
              : "Log in op je Arclight account"}
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center">
              <div className="shrink-0 text-red-500 text-xl mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
                </svg>
              </div>
              <p className="text-sm font-bold text-red-800">{errorMessage}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center">
              <div className="shrink-0 text-emerald-500 text-xl mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                </svg>
              </div>
              <p className="text-sm font-bold text-emerald-800">
                {successMessage}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegistering && (
            <div className="flex gap-4 animate-in fade-in zoom-in duration-300">
              <div className="flex-1">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                  Voornaam
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-medium"
                  placeholder="Peter"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                  Achternaam
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-medium"
                  placeholder="Gerardus"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
              E-mailadres
            </label>
            <input
              type="email"
              className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-medium"
              placeholder="naam@voorbeeld.nl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
              Wachtwoord
            </label>
            <input
              type="password"
              className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-medium"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 hover:shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-70 mt-2"
          >
            {isLoading
              ? "Even geduld..."
              : isRegistering
                ? "Maak account aan"
                : "Inloggen"}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-slate-50">
          <p className="text-slate-500 font-medium">
            {isRegistering ? "Al bekend bij ons?" : "Nog geen lid?"}{" "}
            <button
              type="button"
              onClick={toggleMode}
              className="text-blue-600 font-black hover:text-blue-700 hover:underline transition-all"
            >
              {isRegistering ? "Log hier in" : "Registreer nu"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
