import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="p-4 bg-white shadow-sm flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">
          Arclight
        </Link>
        <div>
          {user ? (
            <div className="flex gap-4 items-center">
              <span>Welkom, {user.userName}</span>
              {user.role !== "Lezer" && (
                <Link to="/admin" className="text-blue-600 underline">
                  Dashboard
                </Link>
              )}
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="text-sm"
              >
                Uitloggen
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded"
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
        </Routes>
      </main>
    </div>
  );
}

export default App;
