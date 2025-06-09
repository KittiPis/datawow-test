export interface LoginResponse {
  success: boolean;
  message: string;
  code: number;
}

export interface AuthApiResponse {
  code: number;
  error?: string;
  [key: string]: unknown;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export type Comment = {
  id: number;
  content: string;
  created_at: string;
  user: {
    id: number;
    username: string;
  };
};

export type PostPre = {
  id: number;
  title: string;
  summary: string;
  author: string;
  category: { id: number; name: string; slug: string };
  comment_count: number;
  created_at: string;
};

export type Post = {
  id: number;
  title: string;
  content: string;
  summary?: string;
  created_at: string;
  category: { id: number; name: string; slug: string };
  author: { id: number; username: string };
  comment_count: number;
  comments: Comment[];
};

export interface User {
  sub: number;
  username: string;
  role: string;
  iat: number;
  exp: number;
  [key: string]: unknown;
}

export interface ApiResponse<T> {
  code: number;
  data?: T;
  error?: string;
}


export interface PatchPostResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    title: string;
    content: string;
    category_id: number;
  };
}

export interface DeletePostResponse {
  success: boolean;
  message: string;
}