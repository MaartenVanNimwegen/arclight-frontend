/**
 * Basic interface for Article (Read-only / Reader-view) */
export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  publishedAt: string | null;

  categoryName?: string;
  categoryId: string;
  authorName?: string;
}

/**
 * Interface for create/update articles
 * Only UI fields
 */
export interface UpsertArticle {
  title: string;
  slug: string;
  summary: string;
  content: string;
  categoryId: string;
}
