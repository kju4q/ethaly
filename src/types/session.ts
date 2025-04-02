export type SessionCategory =
  | "workshop"
  | "social"
  | "talk"
  | "activity"
  | "other";

export interface Session {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  category: SessionCategory;
  isBookmarked?: boolean;
}

export interface SessionFilters {
  categories: SessionCategory[];
  searchQuery: string;
}
