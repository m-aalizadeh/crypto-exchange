// src/services/authStorage.ts
interface AuthData {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const AuthStorage = {
  get: (): AuthData | null => {
    const data = localStorage.getItem("auth");
    return data ? JSON.parse(data) : null;
  },

  set: (data: AuthData): void => {
    localStorage.setItem("auth", JSON.stringify(data));
  },

  clear: (): void => {
    localStorage.removeItem("auth");
  },

  getToken: (): string | null => {
    return AuthStorage.get()?.token || null;
  },

  getRefreshToken: (): string | null => {
    return AuthStorage.get()?.refreshToken || null;
  },

  getUser: (): { id: string; name: string; email: string } | null => {
    return AuthStorage.get()?.user || null;
  },

  setToken: (token: string): void => {
    const current = AuthStorage.get();
    if (current) {
      AuthStorage.set({ ...current, token });
    }
  },
};
