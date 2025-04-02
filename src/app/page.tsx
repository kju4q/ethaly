"use client";

import { useState, useEffect } from "react";
import { Session, SessionCategory } from "@/types/session";
import SessionCard from "@/components/SessionCard";
import NowHappeningBanner from "@/components/NowHappeningBanner";
import AddSessionModal from "@/components/AddSessionModal";
import Toast from "@/components/Toast";
import { PlusIcon, HeartIcon } from "@heroicons/react/24/outline";
import { format, addHours } from "date-fns";
// import { supabase, Event } from "@/lib/supabase";

interface ToastState {
  show: boolean;
  message: string;
  isBookmarked: boolean;
}

function getCategoryStyles(category: SessionCategory): string {
  switch (category) {
    case "workshop":
      return "bg-orange-100 text-orange-800 animate-pulse";
    case "social":
      return "bg-sky-100 text-sky-800 animate-pulse";
    case "talk":
      return "bg-violet-100 text-violet-800 animate-pulse";
    case "activity":
      return "bg-green-100 text-green-800 animate-pulse";
    case "other":
      return "bg-yellow-100 text-yellow-800 animate-pulse";
    default:
      return "bg-purple-100 text-purple-700";
  }
}

export default function Home() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "bookmarks">("all");
  const [selectedCategories, setSelectedCategories] = useState<
    SessionCategory[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    isBookmarked: false,
  });

  // Update date every day at midnight
  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const timeUntilMidnight = tomorrow.getTime() - now.getTime();

      setCurrentDate(now);

      const timeoutId = setTimeout(() => {
        updateDate();
      }, timeUntilMidnight);

      return () => clearTimeout(timeoutId);
    };

    updateDate();
  }, []);

  // Load sessions from localStorage
  useEffect(() => {
    const loadedSessions = JSON.parse(localStorage.getItem("sessions") || "[]");
    const bookmarkedIds = JSON.parse(
      localStorage.getItem("bookmarkedEvents") || "[]"
    );
    setSessions(
      loadedSessions.map((session: Session) => ({
        ...session,
        isBookmarked: bookmarkedIds.includes(session.id),
      }))
    );
  }, []);

  const handleAddSession = (newSession: Omit<Session, "id">) => {
    const session: Session = {
      ...newSession,
      id: Date.now().toString(),
      isBookmarked: false,
    };
    const updatedSessions = [...sessions, session];
    setSessions(updatedSessions);
    localStorage.setItem("sessions", JSON.stringify(updatedSessions));
    setIsModalOpen(false);
  };

  const handleBookmarkToggle = (sessionId: string) => {
    setSessions((prevSessions) =>
      prevSessions.map((session) => {
        if (session.id === sessionId) {
          const newIsBookmarked = !session.isBookmarked;
          setToast({
            show: true,
            message: newIsBookmarked
              ? "Session added to bookmarks"
              : "Session removed from bookmarks",
            isBookmarked: newIsBookmarked,
          });

          // Update localStorage
          const bookmarkedIds = JSON.parse(
            localStorage.getItem("bookmarkedEvents") || "[]"
          );
          if (newIsBookmarked) {
            localStorage.setItem(
              "bookmarkedEvents",
              JSON.stringify([...bookmarkedIds, sessionId])
            );
          } else {
            localStorage.setItem(
              "bookmarkedEvents",
              JSON.stringify(bookmarkedIds.filter((id) => id !== sessionId))
            );
          }

          return { ...session, isBookmarked: newIsBookmarked };
        }
        return session;
      })
    );
  };

  const currentSessions = sessions.filter((session) => {
    const now = new Date();
    const startTime = new Date(session.startTime);
    const endTime = new Date(session.endTime);

    return now >= startTime && now <= endTime;
  });

  const upcomingSessions = sessions.filter((session) => {
    const now = new Date();
    const startTime = new Date(session.startTime);
    const oneHourFromNow = addHours(now, 1);

    return startTime > now && startTime <= oneHourFromNow;
  });

  const filteredSessions = sessions
    .filter((session) => {
      if (activeTab === "bookmarks" && !session.isBookmarked) return false;
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(session.category)
      )
        return false;
      if (
        searchQuery &&
        !session.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !session.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      return true;
    })
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

  const categories: SessionCategory[] = [
    "workshop",
    "social",
    "talk",
    "activity",
    "other",
  ];

  return (
    <main className="min-h-screen bg-[#FFFDF8] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col gap-2 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Ethaly Calendar Vibes
              </h1>
              <p className="text-gray-600 mt-1">
                Stay in sync with every vibe at Ethaly
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              Add Session
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
              🗓️ {format(currentDate, "EEEE, MMMM d")}
            </span>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("all")}
            className={`btn-secondary ${
              activeTab === "all" ? "bg-purple-50 text-purple-700" : ""
            }`}
          >
            All Sessions
          </button>
          <button
            onClick={() => setActiveTab("bookmarks")}
            className={`btn-secondary flex items-center gap-2 ${
              activeTab === "bookmarks" ? "bg-purple-50 text-purple-700" : ""
            }`}
          >
            <HeartIcon className="w-5 h-5" />
            Bookmarks
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
          />
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() =>
                setSelectedCategories((prev) =>
                  prev.includes(category)
                    ? prev.filter((c) => c !== category)
                    : [...prev, category]
                )
              }
              className={`category-pill transition-all duration-200 hover:bg-purple-200 active:scale-[0.98] ${
                selectedCategories.includes(category)
                  ? getCategoryStyles(category)
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <NowHappeningBanner
          currentSessions={currentSessions}
          upcomingSessions={upcomingSessions}
        />

        <div className="space-y-4">
          {filteredSessions.length === 0 ? (
            activeTab === "bookmarks" ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-600 text-lg mb-2">
                  💭 You haven't bookmarked any sessions yet!
                </p>
                <p className="text-gray-500">
                  Find something that sparks your curiosity ✨
                </p>
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-600 text-lg">No sessions found</p>
                <p className="text-gray-500">
                  Try adjusting your filters or search terms
                </p>
              </div>
            )
          ) : (
            filteredSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onBookmarkToggle={handleBookmarkToggle}
              />
            ))
          )}
        </div>
      </div>

      <AddSessionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddSession}
      />

      {toast.show && (
        <Toast
          message={toast.message}
          isBookmarked={toast.isBookmarked}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </main>
  );
}
