import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ArticleDetail from "./pages/Article";
import { useAuth } from "./context/useAuth";
import Profile from "./pages/Profile";

function App() {
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
              A
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">
              Arclight<span className="text-blue-600">.</span>
            </span>
          </Link>

          {/* Navigation Actions */}
          <div className="flex items-center gap-6">
            {isLoggedIn ? (
              <div className="flex items-center gap-6">
                {/* Gebruikers info */}
                <div className="hidden md:flex flex-col items-end border-r border-slate-200 pr-6">
                  <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 leading-none mb-1">
                    Ingelogd als
                  </span>
                  <span className="text-sm font-bold text-slate-900 leading-none">
                    {user?.given_name || "Gebruiker"}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to="/profile"
                    className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                  >
                    Profiel
                  </Link>

                  {user?.role !== "User" && (
                    <Link
                      to="/admin"
                      className="px-5 py-2.5 bg-slate-900 text-white text-sm font-black rounded-xl shadow-lg shadow-slate-200 hover:bg-black hover:-translate-y-0.5 transition-all active:scale-95"
                    >
                      Dashboard
                    </Link>
                  )}

                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span>Uitloggen</span>
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-8 py-3 bg-blue-600 text-white text-sm font-black rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95"
              >
                Inloggen
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/article/:slug" element={<ArticleDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>

      <footer className="bg-white border-t border-slate-100 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Kolom 1: Branding */}
            <div className="col-span-1 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black italic shadow-md shadow-blue-100">
                  A
                </div>
                <span className="text-xl font-black tracking-tighter text-slate-900">
                  Arclight<span className="text-blue-600">.</span>
                </span>
              </Link>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                Jouw dagelijkse bron voor diepgaande artikelen en de laatste
                inzichten op het gebied van technologie en design.
              </p>
            </div>

            {/* Kolom 2: Navigatie */}
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
                Navigatie
              </h4>
              <ul className="space-y-4">
                <li>
                  <Link
                    to="/"
                    className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/profile"
                    className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    Mijn Profiel
                  </Link>
                </li>
                {isLoggedIn && user?.role !== "User" && (
                  <li>
                    <Link
                      to="/admin"
                      className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
                    >
                      Dashboard
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {/* Kolom 3: Community */}
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
                Secties
              </h4>
              <ul className="space-y-4">
                <li>
                  <button
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    Uitgelicht
                  </button>
                </li>
                <li>
                  <span className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer">
                    Nieuwsbrief
                  </span>
                </li>
                <li>
                  <span className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer">
                    Categorieën
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs font-bold text-slate-400">
              © 2026{" "}
              <a
                href="https://solivex.nl"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-600 transition-colors underline"
              >
                Maarten van Nimwegen
              </a>
              . Alle rechten voorbehouden.
            </p>
            <div className="flex gap-8">
              <span className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
                Privacy Policy
              </span>
              <span className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
                Terms of Service
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
