// types.ts
export interface LoginResponse {
  success: boolean;
  message: string;
  code: number;
}

export interface AuthApiResponse {
  code: number;
  error?: string;
  [key: string]: any; // เผื่อมีฟิลด์เพิ่มเติม เช่น user info
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

// PostPre (จาก API)
export type PostPre = {
  id: number;
  title: string;
  summary: string;
  author: string; // ❗ string
  category: { id: number; name: string; slug: string };
  comment_count: number;
  created_at: string;
};

// Post (ใน UI)
export type Post = {
  id: number;
  title: string;
  content: string;     // ❗ ต้องเติมเพิ่ม
  summary: string;
  created_at: string;
  category: { id: number; name: string; slug: string };
  author: { id: number; username: string }; // ❗ ต้องแปลงจาก string
  comment_count: number;
  comments: Comment[]; // ❗ ต้องเติมเพิ่ม
};


export interface User {
  sub: number;
  username: string;
  role: string;
  iat: number;
  exp: number;
  [key: string]: any;
}

export interface ApiResponse<T> {
  code: number;
  data?: T;
  error?: string;
}
