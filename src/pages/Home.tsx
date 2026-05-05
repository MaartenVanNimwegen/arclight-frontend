import { useEffect, useState } from "react";
import { articleService } from "../services/articleService";
import type { Article } from "../types/article";
import { Link } from "react-router-dom";

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    articleService.getAll().then(setArticles);
  }, []);

  const filteredArticles = articles.filter((article) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      article.title.toLowerCase().includes(searchLower) ||
      article.summary.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <header className="mb-12 border-b pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
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
                  <span className="text-[10px] text-slate-400 font-medium">
                    Door: {article.authorName}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* Lege staat als er geen zoekresultaten zijn */
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-bold text-slate-900">
            Geen artikelen gevonden
          </h3>
          <p className="text-slate-500">
            Probeer een andere zoekterm of wis de zoekbalk.
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="mt-4 text-blue-600 font-bold hover:underline"
          >
            Wis zoekopdracht
          </button>
        </div>
      )}
    </div>
  );
}
