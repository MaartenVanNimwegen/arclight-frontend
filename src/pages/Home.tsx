import { useEffect, useState } from "react";
import { articleService } from "../services/articleService";
import type { Article } from "../types/article";
import { Link } from "react-router-dom";
import client from "../api/client";

interface Category {
  id: string;
  name: string;
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  ); // null = Alle categorieën

  useEffect(() => {
    // Haal zowel artikelen als categorieën op
    articleService.getAll().then(setArticles);
    client.get("/categories").then((res) => setCategories(res.data));
  }, []);

  // De Filter Logica: Zoekterm + Categorie
  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategoryId === null ||
      article.categoryName === selectedCategoryId;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <header className="mb-12 border-b pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              Uitgelichte Artikelen
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Ontdek de nieuwste inzichten van Arclight.
            </p>
          </div>

          {/* Zoekbalk */}
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Zoek artikelen..."
              className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-2xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Categorie Filter Sectie */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategoryId(null)}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
              selectedCategoryId === null
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Alle
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategoryId(cat.name)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                selectedCategoryId === cat.name
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </header>

      {/* Grid met resultaten */}
      {filteredArticles.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              className="group flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all animate-in fade-in duration-300"
            >
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-x-3 text-xs mb-4">
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium uppercase tracking-wider">
                    {article.categoryName || "Algemeen"}
                  </span>
                  <time className="text-slate-500">
                    {new Date(article.publishedAt || "").toLocaleDateString(
                      "nl-NL",
                    )}
                  </time>
                </div>
                <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h2>
                <p className="mt-3 text-slate-600 line-clamp-3 text-sm leading-relaxed">
                  {article.summary}
                </p>
                <div className="mt-auto pt-6 flex justify-between items-center">
                  <Link
                    to={`/article/${article.slug}`}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Lees meer →
                  </Link>
                  <span className="text-[10px] text-slate-400 font-medium italic">
                    {article.authorName}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-bold text-slate-900">
            Geen artikelen gevonden
          </h3>
          <p className="text-slate-500">
            Probeer een andere zoekterm of categorie.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategoryId(null);
            }}
            className="mt-4 text-blue-600 font-bold hover:underline"
          >
            Herstel filters
          </button>
        </div>
      )}

      <NewsletterSignup />
    </div>
  );
}

function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await client.post("/newsletter/subscribe", {
        Email: email,
      });
      setStatus({ type: "success", msg: res.data.message });
      setEmail("");
    } catch (err: any) {
      setStatus({
        type: "error",
        msg:
          err.response?.data?.error ||
          "Er is iets misgegaan. Probeer het later opnieuw.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-24 bg-slate-900 rounded-[3rem] p-8 md:p-16 text-center text-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/20 blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-black mb-4">
          Blijf op de hoogte
        </h2>
        <p className="text-slate-400 mb-10 text-lg">
          Ontvang de wekelijkse Arclight Digest direct in je inbox.
        </p>

        <form
          onSubmit={handleSubscribe}
          className="flex flex-col sm:flex-row gap-3"
        >
          <input
            type="email"
            placeholder="jouw@email.nl"
            className="flex-1 px-6 py-4 rounded-2xl bg-white/10 border border-white/10 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Bezig..." : "Inschrijven"}
          </button>
        </form>

        {status && (
          <div
            className={`mt-6 p-4 rounded-xl font-bold animate-in fade-in slide-in-from-top-2 ${
              status.type === "success"
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {status.msg}
          </div>
        )}
      </div>
    </section>
  );
}
