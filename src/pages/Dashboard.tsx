import { useState, useEffect } from "react";
import { articleService } from "../services/articleService";
import type { Article } from "../types/article";

export default function Dashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: "",
    summary: "",
    content: "",
    categoryId: 1,
  });

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    const data = await articleService.getAll();
    setArticles(data);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await articleService.create(newArticle);
      setIsModalOpen(false);
      loadArticles();
      setNewArticle({ title: "", summary: "", content: "", categoryId: 1 });
    } catch (err) {
      alert("Fout bij aanmaken artikel. Ben je wel ingelogd?");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Content Management
          </h1>
          <p className="text-slate-500 mt-1">Beheer de Arclight kennisbank</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-95"
        >
          + Nieuw Artikel
        </button>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                Artikel
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">
                Acties
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {articles.map((article) => (
              <tr
                key={article.id}
                className="hover:bg-slate-50/80 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-900">
                    {article.title}
                  </div>
                  <div className="text-sm text-slate-500 truncate max-w-xs">
                    {article.summary}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                    Gepubliceerd
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-4">
                  <button className="text-blue-600 font-bold text-sm hover:underline">
                    Bewerk
                  </button>
                  <button className="text-red-500 font-bold text-sm hover:underline">
                    Verwijder
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-bold mb-6">Nieuw artikel schrijven</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <input
                className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Titel van het artikel"
                value={newArticle.title}
                onChange={(e) =>
                  setNewArticle({ ...newArticle, title: e.target.value })
                }
                required
              />
              <textarea
                className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 h-24"
                placeholder="Korte samenvatting..."
                value={newArticle.summary}
                onChange={(e) =>
                  setNewArticle({ ...newArticle, summary: e.target.value })
                }
              />
              <textarea
                className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 h-48"
                placeholder="De volledige content..."
                value={newArticle.content}
                onChange={(e) =>
                  setNewArticle({ ...newArticle, content: e.target.value })
                }
              />
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
                >
                  Publiceren
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
