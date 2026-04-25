import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ArticleDetail from "./pages/Article";
import { useAuth } from "./context/AuthContext";

function App() {
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="p-4 bg-white shadow-sm flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">
          Arclight
        </Link>
        <div>
          {isLoggedIn ? (
            <div className="flex gap-4 items-center">
              <span className="text-sm font-medium">Welkom, {user?.given_name}</span>
              {user?.role !== "User" && (
                <Link to="/admin" className="text-blue-600 underline">
                  Dashboard
                </Link>
              )}
              <button
                onClick={logout}
                className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200 transition"
              >
                Uitloggen
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 transition"
            >
              Inloggen
            </Link>
          )}
        </div>
      </nav>

      <main className="container mx-auto p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/article/:slug" element={<ArticleDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;