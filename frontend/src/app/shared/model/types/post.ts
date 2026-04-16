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

export function SearchPostById(posts: Post[], id: string): Post {
  const post = posts.find((post) => post.id === id)!;
  return post;
}

export function SearchPostBySlug(posts: Post[], slug: string): Post {
  const post = posts.find((post) => post.slug === slug)!;
  return post;
}

export interface PostPageData {
  post: Post;
  recommended: Post[];
  latest: Post[];
}
