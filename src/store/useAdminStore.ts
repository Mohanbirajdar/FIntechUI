"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  MockUser, MockCategory, AdminNotification,
  generateMockUsers, generateMockCategories, DEFAULT_NOTIFICATIONS
} from "@/lib/adminMockData";
import { generateId } from "@/lib/utils";

interface AdminState {
  isAdminAuthenticated: boolean;
  users: MockUser[];
  categories: MockCategory[];
  notifications: AdminNotification[];
  initialized: boolean;

  // Auth
  adminLogin: (email: string, password: string) => boolean;
  adminLogout: () => void;

  // Users
  updateUserStatus: (id: string, status: MockUser["status"]) => void;
  deleteUser: (id: string) => void;

  // Categories
  addCategory: (cat: Omit<MockCategory, "id" | "transactionCount" | "totalAmount">) => void;
  updateCategory: (id: string, cat: Partial<MockCategory>) => void;
  deleteCategory: (id: string) => void;

  // Notifications
  addNotification: (n: Omit<AdminNotification, "id" | "sentAt" | "readCount" | "totalUsers">) => void;
  deleteNotification: (id: string) => void;

  // Init
  initialize: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      isAdminAuthenticated: false,
      users: [],
      categories: [],
      notifications: DEFAULT_NOTIFICATIONS,
      initialized: false,

      adminLogin: (email, password) => {
        const valid =
          (email === "admin@fintrack.com" && password === "admin123") ||
          (email === "admin" && password === "admin");
        if (valid) {
          set({ isAdminAuthenticated: true });
          return true;
        }
        return false;
      },

      adminLogout: () => set({ isAdminAuthenticated: false }),

      updateUserStatus: (id, status) => {
        set((s) => ({
          users: s.users.map((u) => (u.id === id ? { ...u, status } : u)),
        }));
      },

      deleteUser: (id) => {
        set((s) => ({ users: s.users.filter((u) => u.id !== id) }));
      },

      addCategory: (cat) => {
        set((s) => ({
          categories: [
            ...s.categories,
            { ...cat, id: generateId(), transactionCount: 0, totalAmount: 0 },
          ],
        }));
      },

      updateCategory: (id, cat) => {
        set((s) => ({
          categories: s.categories.map((c) => (c.id === id ? { ...c, ...cat } : c)),
        }));
      },

      deleteCategory: (id) => {
        set((s) => ({ categories: s.categories.filter((c) => c.id !== id) }));
      },

      addNotification: (n) => {
        const totalUsers = get().users.length || 200;
        set((s) => ({
          notifications: [
            {
              ...n,
              id: generateId(),
              sentAt: new Date().toISOString(),
              readCount: 0,
              totalUsers,
            },
            ...s.notifications,
          ],
        }));
      },

      deleteNotification: (id) => {
        set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) }));
      },

      initialize: () => {
        if (!get().initialized) {
          set({
            users: generateMockUsers(),
            categories: generateMockCategories(),
            initialized: true,
          });
        }
      },
    }),
    {
      name: "fintech-admin",
      partialize: (s) => ({
        isAdminAuthenticated: s.isAdminAuthenticated,
        users: s.users,
        categories: s.categories,
        notifications: s.notifications,
        initialized: s.initialized,
      }),
    }
  )
);
