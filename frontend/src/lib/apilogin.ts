import { User, ApiResponse } from "@/types/types";
interface LogoutResponse {
  success: boolean;
  message: string;
  code: number;
}

export async function login(username: string): Promise<boolean> {
  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchUser(): Promise<User | null> {
  try {
    const res = await fetch("/api/me", {
      credentials: "include",
    });

    const data: User = await res.json();
    if (data && data.username) {
      return data;
    }

    return null;
  } catch {
    return null;
  }
}

export async function logoutUser(): Promise<LogoutResponse> {
  try {
    const res = await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });

    const data: ApiResponse<null> = await res.json();

    return {
      success: data.code === 200,
      message: data.error || "Logout failed",
      code: data.code,
    };
  } catch (error: unknown) {
    let message = "Network error. Please try again.";

    if (error instanceof Error) {
      message = error.message;
    }

    return {
      success: false,
      message,
      code: 500,
    };
  }
}
