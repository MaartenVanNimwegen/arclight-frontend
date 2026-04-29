import { useState } from "react";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await authService.register({ email, firstName, lastName, password });

        setIsRegistering(false);
        setPassword("");
        setSuccessMessage("Your account is ready! Log here below.");
        setIsRegistering(false);
      } else {
        const response = await authService.login(email, password);
        login(response.token);
        navigate("/");
      }
    } catch (err) {
      alert(
        isRegistering
          ? "Registreren mislukt. Bestaat dit e-mailadres al?"
          : "Inloggen mislukt.",
      );
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-slate-100 transition-all duration-300">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900">
            {isRegistering ? "Account aanmaken" : "Welkom terug"}
          </h2>
          <p className="text-slate-500 mt-2">
            {isRegistering
              ? "Word onderdeel van Arclight"
              : "Log in op je Arclight account"}
          </p>
        </div>
        {successMessage && (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-bold mb-6 border border-green-100 animate-in fade-in slide-in-from-top-2">
            {successMessage}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Alleen tonen als we aan het registreren zijn */}
          {isRegistering && (
            <div className="flex gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Voornaam
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Peter"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required={isRegistering}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Achternaam
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Gerardus"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required={isRegistering}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              E-mailadres
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="naam@voorbeeld.nl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Wachtwoord
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
          >
            {isRegistering ? "Account aanmaken" : "Inloggen"}
          </button>
        </form>

        {/* Toggle knop */}
        <div className="mt-8 text-center border-t border-slate-100 pt-6">
          <p className="text-slate-500 text-sm">
            {isRegistering ? "Heb je al een account?" : "Nog geen account?"}{" "}
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-blue-600 font-bold hover:underline focus:outline-none"
            >
              {isRegistering ? "Log hier in" : "Registreer nu"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
