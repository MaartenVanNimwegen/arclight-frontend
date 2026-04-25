import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { articleService } from "../services/articleService";
import type { Article } from "../types/article";

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      articleService
        .getBySlug(slug)
        .then(setArticle)
        .catch(() => console.error("Artikel niet gevonden"))
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading)
    return <div className="text-center py-20 text-slate-500">Laden...</div>;
  if (!article)
    return (
      <div className="text-center py-20 text-red-500 font-bold">
        Artikel niet gevonden.
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      {/* Back button */}
      <Link
        to="/"
        className="text-blue-600 font-medium hover:underline flex items-center gap-2 mb-8 group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">
          ←
        </span>{" "}
        Terug naar overzicht
      </Link>

      <article>
        <header className="mb-10 text-center">
          <div className="flex justify-center items-center gap-3 text-sm text-slate-500 mb-4">
            <span className="bg-slate-100 px-3 py-1 rounded-full font-medium text-slate-700 uppercase tracking-wide">
              {article.categoryName || "Algemeen"}
            </span>
            <time>
              {article.publishedAt
                ? new Date(article.publishedAt).toLocaleDateString("nl-NL", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "Concept"}
            </time>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6">
            {article.title}
          </h1>

          <p className="text-xl text-slate-600 leading-relaxed italic">
            {article.summary}
          </p>
        </header>

        {/* Content gedeelte */}
        <div className="prose prose-slate prose-lg max-w-none text-slate-800 leading-8">
          {/* We gebruiken hier whitespace-pre-wrap voor eenvoudige tekst, 
              later kun je een markdown renderer gebruiken */}
          <div className="whitespace-pre-wrap">{article.content}</div>
        </div>
      </article>

      <footer className="mt-16 pt-8 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-sm">
          Bedankt voor het lezen van Arclight.
        </p>
      </footer>
    </div>
  );
}
