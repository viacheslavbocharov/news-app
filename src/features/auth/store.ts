import { create } from "zustand";
import usersJson from "@/mocks/users.json";
import type { Credentials, User } from "./types";

const LS_KEY = "auth:user";

/** Строка из users.json (включая пароль для проверки на клиенте в моках) */
type UserRow = {
  id: string;
  name: string;
  email: string;
  password: string;
};

/** Жёстко типизируем импорт JSON-а как массив UserRow */
const USERS: readonly UserRow[] = usersJson as unknown as UserRow[];

type AuthState = {
  user: User | null;
  error: string | null;
  signIn: (creds: Credentials) => Promise<boolean>;
  signOut: () => void;
  _hydrate: () => void;
};

function toPublicUser(u: UserRow): User {
  return { id: u.id, name: u.name, email: u.email };
}

export const useAuth = create<AuthState>()((set) => ({
  user: null,
  error: null,

  async signIn({ email, password }) {
    const found = USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    );

    if (!found) {
      set({ error: "Invalid email or password" });
      return false;
    }

    const publicUser = toPublicUser(found);
    localStorage.setItem(LS_KEY, JSON.stringify(publicUser));
    set({ user: publicUser, error: null });
    return true;
  },

  signOut() {
    localStorage.removeItem(LS_KEY);
    set({ user: null, error: null });
  },

  _hydrate() {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as User;
      set({ user: parsed, error: null });
    } catch {
      // ignore parse error
    }
  },
}));

// инициализация из localStorage при первом импорте стора
useAuth.getState()._hydrate();
