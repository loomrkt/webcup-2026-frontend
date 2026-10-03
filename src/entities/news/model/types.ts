export interface PublicationAuthor {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

export interface Publication {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  coverImage: string | null;
  published: boolean;
  publishedAt: string | null;
  authorId: string | null;
  author?: PublicationAuthor | null;
  createdAt: string;
  updatedAt: string;
}