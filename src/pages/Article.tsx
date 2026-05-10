import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { articleService } from "../services/articleService";
import { useAuth } from "../context/AuthContext";
import { useConfirm } from "../context/ConfirmContext";
import client from "../api/client";
import type { Article } from "../types/article";

interface Comment {
  id: string;
  text: string;
  authorName: string;
  userId: string;
  createdAt: string;
}

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { user, isLoggedIn } = useAuth();
  const { confirm } = useConfirm();

  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (slug) {
      loadArticleAndComments();
    }
  }, [slug]);

  const loadArticleAndComments = async () => {
    try {
      // Get articles and set articles
      const art = await articleService.getBySlug(slug!);
      setArticle(art);

      // Get comments for the article and set comments
      const commentRes = await client.get(`/articles/${art.id}/comments`);
      setComments(commentRes.data);
    } catch (err) {
      console.error("Data laden mislukt", err);
    } finally {
      setLoading(false);
    }
  };

  // Handles new comment submission
  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !article) return;

    setSubmitting(true);
    try {
      await client.post(`/articles/${article.id}/comments`, {
        Text: newComment,
      });

      setNewComment("");
      const res = await client.get(`/articles/${article.id}/comments`);
      setComments(res.data);
    } catch (err) {
      alert("Reactie plaatsen mislukt.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handles comment deletion with confirmation
  const handleDeleteComment = async (commentId: string) => {
    const isConfirmed = await confirm({
      title: "Reactie verwijderen",
      message: "Weet je zeker dat je jouw reactie wilt verwijderen?",
      confirmText: "Verwijder",
      isDanger: true,
    });

    if (isConfirmed && article) {
      try {
        await client.delete(`/articles/${article.id}/comments/${commentId}`);
        setComments(comments.filter((c) => c.id !== commentId));
      } catch (err) {
        alert("Verwijderen mislukt.");
      }
    }
  };

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
          <span className="text-slate-500">Door: {article.authorName}</span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6">
            {article.title}
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed italic">
            {article.summary}
          </p>
        </header>

        <div className="prose prose-slate prose-lg max-w-none text-slate-800 leading-8 border-b border-slate-100 pb-16">
          <div className="whitespace-pre-wrap">{article.content}</div>
        </div>
      </article>

      {/* --- COMMENT SECTION --- */}
      <section className="mt-16 space-y-10">
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
          Reacties{" "}
          <span className="text-sm bg-slate-100 text-slate-500 px-2 py-1 rounded-lg">
            {comments.length}
          </span>
        </h2>

        {/* Form: Only show if logged in */}
        {isLoggedIn ? (
          <form onSubmit={handlePostComment} className="space-y-4">
            <textarea
              className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all resize-none h-32"
              placeholder="Wat vind jij hiervan?"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 disabled:opacity-50 transition-all active:scale-95"
              >
                {submitting ? "Plaatsen..." : "Reactie plaatsen"}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-slate-50 p-6 rounded-2xl text-center border border-dashed border-slate-200">
            <p className="text-slate-600 mb-4 font-medium">
              Log in om mee te praten over dit artikel.
            </p>
            <Link
              to="/login"
              className="inline-block bg-white border border-slate-200 px-6 py-2 rounded-xl font-bold text-slate-900 hover:bg-slate-50 transition-colors"
            >
              Inloggen
            </Link>
          </div>
        )}

        {/* List with comments */}
        <div className="space-y-6">
          {comments.length > 0 ? (
            comments.map((c) => {
              const isOwner =
                user?.nameid === c.userId || user?.sub === c.userId;

              return (
                <div
                  key={c.id}
                  className="group relative bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="font-black text-slate-900 text-sm">
                        {c.authorName}
                      </span>
                      <span className="text-slate-400 text-[10px] ml-2 font-bold uppercase tracking-widest">
                        {new Date(c.createdAt).toLocaleDateString("nl-NL", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>

                    {isOwner && (
                      <button
                        onClick={() => handleDeleteComment(c.id)}
                        className="text-red-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                  <p className="text-slate-700 leading-relaxed">{c.text}</p>
                </div>
              );
            })
          ) : (
            <p className="text-center text-slate-400 italic py-10">
              Nog geen reacties. Wees de eerste!
            </p>
          )}
        </div>
      </section>

      <footer className="mt-32 pt-8 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-sm">
          Bedankt voor het lezen van Arclight.
        </p>
      </footer>
    </div>
  );
}
