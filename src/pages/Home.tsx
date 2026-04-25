import { useEffect, useState } from "react";
import { articleService } from "../services/articleService";
import type { Article } from "../types/article";
import { Link } from "react-router-dom";

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    articleService.getAll().then(setArticles);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <header className="mb-12 border-b pb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          Uitgelichte Artikelen
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Ontdek de nieuwste inzichten van Arclight.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <article
            key={article.id}
            className="group flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all"
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
              <div className="mt-auto pt-6">
                <Link
                  to={`/article/${article.slug}`}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Lees volledige artikel →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
