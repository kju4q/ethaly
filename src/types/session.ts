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
  startTime: Date;
  endTime: string; // Format: "HH:mm" (24-hour format)
  category: SessionCategory;
  location?: string;
  isBookmarked?: boolean;
}

export interface SessionFilters {
  categories: SessionCategory[];
  searchQuery: string;
}
