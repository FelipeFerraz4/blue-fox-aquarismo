export interface Post {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  category: string;
  slug: string;
  readingTime: string;
  author: string;
}

export function SearchPostById(posts: Post[], id: string): Post | undefined {
  return posts.find((post) => post.id === id);
}

export function SearchPostBySlug(posts: Post[], slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

export interface PostPageData {
  post: Post;
  recommended: Post[];
  latest: Post[];
}
