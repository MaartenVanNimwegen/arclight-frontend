import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useConfirm } from "../context/ConfirmContext"; // De nieuwe magische hook!
import { articleService } from "../services/articleService";
import client from "../api/client";
import type { Article } from "../types/article";

// ==========================================
// HOOFD COMPONENT
// ==========================================
export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("articles");

  // Rechten bepalen op basis van de claim in je JWT
  const isAdmin = user?.role === "Admin";
  const isContentCreator = user?.role === "ContentCreator" || isAdmin;

  // Tabs definitie. We filteren tabs weg waar de gebruiker geen recht op heeft.
  const tabs = [
    { id: "articles", label: "Artikelen", allowed: isContentCreator },
    { id: "categories", label: "Categorieën", allowed: isAdmin },
    { id: "comments", label: "Reacties", allowed: isContentCreator },
    { id: "users", label: "Gebruikers", allowed: isAdmin },
  ].filter((tab) => tab.allowed);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      {/* Dashboard Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900">Arclight Studio</h1>
        <p className="text-slate-500 mt-1 flex items-center gap-2">
          Ingelogd als{" "}
          <span className="font-bold text-blue-600">
            {user?.userName || user?.given_name || "Gebruiker"}
          </span>
          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider">
            {user?.role}
          </span>
        </p>
      </div>

      {/* Tab Navigatie */}
      <div className="flex gap-2 border-b border-slate-200 mb-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-bold text-sm transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Render de actieve tab */}
      <div className="animate-in fade-in duration-300">
        {activeTab === "articles" && <ArticlesTab />}
        {activeTab === "categories" && <CategoriesTab />}
        {activeTab === "comments" && <CommentsTab />}
        {activeTab === "users" && <UsersTab />}
      </div>
    </div>
  );
}

// ==========================================
// TAB 1: ARTIKELEN
// ==========================================
function ArticlesTab() {
  const { confirm } = useConfirm();
  const [published, setPublished] = useState<Article[]>([]);
  const [drafts, setDrafts] = useState<Article[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    categoryId: "",
    publishNow: false,
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [liveRes, draftRes, catRes] = await Promise.all([
        articleService.getAll(),
        articleService.getDrafts(),
        client.get("/categories"),
      ]);
      setPublished(liveRes);
      setDrafts(draftRes);
      setCategories(catRes.data);
      if (catRes.data.length > 0 && !editingId) {
        setFormData((prev) => ({ ...prev, categoryId: catRes.data[0].id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenModal = (article?: any) => {
    if (article) {
      setEditingId(article.id);
      setFormData({
        title: article.title,
        summary: article.summary,
        content: article.content,
        categoryId: article.categoryId || categories[0]?.id,
        publishNow: false,
      });
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        summary: "",
        content: "",
        categoryId: categories[0]?.id || "",
        publishNow: false,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await articleService.update(editingId, formData);
      } else {
        await articleService.create(formData);
      }
      setIsModalOpen(false);
      loadInitialData();
    } catch (err) {
      alert("Opslaan mislukt. Controleer of alle velden zijn ingevuld.");
    }
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = await confirm({
      title: "Artikel verwijderen",
      message:
        "Weet je zeker dat je dit artikel wilt weggooien? Dit kan niet ongedaan worden gemaakt.",
      confirmText: "Verwijder Artikel",
      isDanger: true,
    });

    if (isConfirmed) {
      try {
        await articleService.delete(id);
        await loadInitialData();
      } catch (err) {
        alert("Fout bij verwijderen.");
      }
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await articleService.publish(id);
      await loadInitialData();
    } catch (err) {
      alert("Publiceren mislukt.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
        >
          + Nieuw Artikel
        </button>
      </div>

      <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-slate-800">
          <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>{" "}
          Concepten
        </h2>
        <ArticleGrid
          articles={drafts}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          onPublish={handlePublish}
        />
      </section>

      <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-slate-800">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>{" "}
          Gepubliceerd
        </h2>
        <ArticleGrid
          articles={published}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />
      </section>

      {/* Modal voor Artikel Maken/Bewerken */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? "Artikel aanpassen" : "Nieuw meesterwerk schrijven"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                className="w-full p-4 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Titel"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
              <div className="flex gap-4">
                <select
                  className="flex-1 p-4 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryId: e.target.value })
                  }
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {!editingId && (
                  <label className="flex items-center gap-2 px-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition">
                    <input
                      type="checkbox"
                      className="w-5 h-5 accent-blue-600"
                      checked={formData.publishNow}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          publishNow: e.target.checked,
                        })
                      }
                    />
                    <span className="text-sm font-medium text-slate-700">
                      Direct publiceren
                    </span>
                  </label>
                )}
              </div>
              <textarea
                className="w-full p-4 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500 h-24"
                placeholder="Korte samenvatting..."
                value={formData.summary}
                onChange={(e) =>
                  setFormData({ ...formData, summary: e.target.value })
                }
              />
              <textarea
                className="w-full p-4 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500 h-64 font-mono text-sm"
                placeholder="Schrijf hier je verhaal..."
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
              />
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 py-4 rounded-xl transition"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold shadow-md hover:bg-blue-700 transition"
                >
                  Opslaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// TAB 2: CATEGORIEËN
// ==========================================
function CategoriesTab() {
  const { confirm } = useConfirm();
  const [categories, setCategories] = useState<any[]>([]);
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");

  useEffect(() => {
    loadCats();
  }, []);

  const loadCats = async () => {
    const res = await client.get("/categories");
    setCategories(res.data);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await client.post("/categories", {
        name: newCatName,
        description: newCatDesc,
      });
      setNewCatName("");
      setNewCatDesc("");
      loadCats();
    } catch (err) {
      alert("Fout bij aanmaken");
    }
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = await confirm({
      title: "Categorie verwijderen",
      message:
        "Weet je dit zeker? Let op: mogelijk kan dit falen als er nog artikelen aan gekoppeld zijn.",
      confirmText: "Wis Categorie",
      isDanger: true,
    });

    if (isConfirmed) {
      try {
        await client.delete(`/categories/${id}`);
        await loadCats();
      } catch (err) {
        alert("Kan niet wissen. Zorg dat de categorie leeg is.");
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-fit">
        <h3 className="font-bold text-lg mb-4 text-slate-800">
          Nieuwe Categorie
        </h3>
        <form onSubmit={handleCreate} className="space-y-4">
          <input
            className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Naam"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            required
          />
          <input
            className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Beschrijving"
            value={newCatDesc}
            onChange={(e) => setNewCatDesc(e.target.value)}
          />
          <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition">
            Toevoegen
          </button>
        </form>
      </div>
      <div className="md:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-4 font-bold text-slate-500 text-sm">Naam</th>
              <th className="p-4 font-bold text-slate-500 text-sm">
                Beschrijving
              </th>
              <th className="p-4 font-bold text-slate-500 text-sm text-right">
                Actie
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/50 transition">
                <td className="p-4 font-bold text-slate-800">{c.name}</td>
                <td className="p-4 text-sm text-slate-500">
                  {c.description || "-"}
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-red-500 font-bold text-sm bg-red-50 px-3 py-1 rounded-lg hover:bg-red-100 transition"
                  >
                    Wis
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==========================================
// TAB 3: REACTIES (Voorbereiding)
// ==========================================
function CommentsTab() {
  return (
    <div className="bg-white p-16 rounded-3xl border border-slate-100 text-center shadow-sm">
      <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
        💬
      </div>
      <h3 className="text-2xl font-bold text-slate-800">Reactie Moderatie</h3>
      <p className="text-slate-500 mt-3 max-w-md mx-auto leading-relaxed">
        Hier komt een overzicht van alle reacties over het hele platform.
        Wachtend op de{" "}
        <code className="bg-slate-100 px-2 py-1 rounded font-mono text-sm">
          GET /comments
        </code>{" "}
        route in je C# backend.
      </p>
    </div>
  );
}

// ==========================================
// TAB 4: GEBRUIKERSBEHEER
// ==========================================
function UsersTab() {
  const { user: currentUser } = useAuth();
  const { confirm } = useConfirm();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const roles = ["Admin", "ContentCreator", "User"];

  const normalizeRole = (roleValue: any) => {
    if (roleValue === 0 || roleValue === "0") return "User";
    if (roleValue === 1 || roleValue === "1") return "ContentCreator";
    if (roleValue === 2 || roleValue === "2") return "Admin";
    return roleValue;
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await client.get("/user");
      setUsers(
        res.data.map((u: any) => ({ ...u, role: normalizeRole(u.role) })),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await client.put(`/user/${userId}/${newRole}`);
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
      );
    } catch (err) {
      alert("Kon rol niet aanpassen. Check de server logs.");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const isConfirmed = await confirm({
      title: "Gebruiker verwijderen",
      message:
        "Weet je zeker dat je deze account wilt wissen? Alle data gaat permanent verloren.",
      confirmText: "Wis Gebruiker",
      isDanger: true,
    });

    if (isConfirmed) {
      try {
        await client.delete(`/user/${userId}`);
        await loadUsers();
      } catch (err) {
        alert("Fout bij verwijderen gebruiker.");
      }
    }
  };

  if (loading)
    return (
      <div className="text-center py-20 text-slate-500 font-medium animate-pulse">
        Gebruikers laden...
      </div>
    );

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-50 flex justify-between items-center">
        <h3 className="font-bold text-lg text-slate-800">
          Geregistreerde Gebruikers
        </h3>
        <span className="text-sm font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-600">
          {users.length} totaal
        </span>
      </div>

      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            <th className="p-4 font-bold text-slate-500 text-sm">
              Naam & Email
            </th>
            <th className="p-4 font-bold text-slate-500 text-sm">
              Huidige Rol
            </th>
            <th className="p-4 font-bold text-slate-500 text-sm text-right">
              Acties
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {users.map((u) => {
            const isSelf =
              u.email === currentUser?.email ||
              u.id === currentUser?.nameid ||
              u.id === currentUser?.sub;

            return (
              <tr
                key={u.id}
                className={`transition-colors ${isSelf ? "bg-blue-50/20" : "hover:bg-slate-50/50"}`}
              >
                <td className="p-4">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    {u.firstName} {u.lastName}
                    {isSelf && (
                      <span className="bg-blue-100 text-blue-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                        Jij
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{u.email}</div>
                </td>
                <td className="p-4">
                  <select
                    value={u.role}
                    disabled={isSelf}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    className={`text-xs font-bold px-3 py-2 rounded-lg border-none outline-none transition-all ${
                      isSelf
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer focus:ring-2 focus:ring-blue-500 shadow-sm"
                    } ${
                      u.role === "Admin"
                        ? "bg-purple-100 text-purple-700"
                        : u.role === "ContentCreator"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-4 text-right">
                  {isSelf ? (
                    <span className="text-xs text-slate-400 font-medium italic mr-2">
                      Beveiligd
                    </span>
                  ) : (
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-bold transition-colors bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100"
                    >
                      Wis
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ==========================================
// HERBRUIKBARE GRID VOOR ARTIKELEN
// ==========================================
function ArticleGrid({ articles, onEdit, onDelete, onPublish }: any) {
  if (articles.length === 0)
    return (
      <div className="text-slate-400 italic py-10 text-center border-2 border-dashed border-slate-200 rounded-2xl">
        Geen artikelen gevonden.
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {articles.map((a: any) => (
        <div
          key={a.id}
          className="p-5 bg-white border border-slate-100 shadow-sm rounded-2xl hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-50 px-2 py-1 rounded">
                {a.categoryName}
              </span>
              {!a.publishedAt && (
                <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded font-bold uppercase tracking-widest">
                  Concept
                </span>
              )}
            </div>
            <h3 className="font-bold text-lg text-slate-900 line-clamp-1">
              {a.title}
            </h3>
            <p className="text-sm text-slate-500 mt-2 line-clamp-2">
              {a.summary}
            </p>
          </div>
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-50">
            <span className="text-xs font-medium text-slate-400">
              Door {a.authorName}
            </span>
            <div className="flex gap-2">
              {!a.publishedAt && onPublish && (
                <button
                  onClick={() => onPublish(a.id)}
                  className="text-xs font-bold text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Publiceer
                </button>
              )}
              <button
                onClick={() => onEdit(a)}
                className="text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                Bewerk
              </button>
              <button
                onClick={() => onDelete(a.id)}
                className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                Wis
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
