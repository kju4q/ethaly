import { Session } from "@/types/session";

const SESSIONS_KEY = "event_sessions";
const BOOKMARKS_KEY = "event_bookmarks";

export const getSessions = (): Session[] => {
  if (typeof window === "undefined") return [];
  const sessions = localStorage.getItem(SESSIONS_KEY);
  return sessions ? JSON.parse(sessions) : [];
};

export const saveSessions = (sessions: Session[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
};

export const getBookmarkedSessionIds = (): string[] => {
  if (typeof window === "undefined") return [];
  const bookmarks = localStorage.getItem(BOOKMARKS_KEY);
  return bookmarks ? JSON.parse(bookmarks) : [];
};

export const saveBookmarkedSessionIds = (sessionIds: string[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(sessionIds));
};

export const toggleBookmark = (sessionId: string): void => {
  const bookmarkedIds = getBookmarkedSessionIds();
  const newBookmarkedIds = bookmarkedIds.includes(sessionId)
    ? bookmarkedIds.filter((id) => id !== sessionId)
    : [...bookmarkedIds, sessionId];
  saveBookmarkedSessionIds(newBookmarkedIds);
};
