import { Session } from "@/types/session";
import { format, differenceInMinutes } from "date-fns";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import { toggleBookmark } from "@/utils/storage";

interface SessionCardProps {
  session: Session;
  onBookmarkToggle: (sessionId: string) => void;
}

const categoryColors = {
  workshop: "bg-[#F9A8D4] text-pink-800",
  social: "bg-[#93C5FD] text-blue-800",
  talk: "bg-[#A855F7] text-purple-800",
  activity: "bg-[#6EE7B7] text-green-800",
  other: "bg-gray-100 text-gray-800",
};

export default function SessionCard({
  session,
  onBookmarkToggle,
}: SessionCardProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const [hours, minutes] = session.endTime.split(":").map(Number);
      const endTime = new Date(new Date(session.startTime));
      endTime.setHours(hours, minutes, 0, 0);

      if (now > endTime) {
        setTimeRemaining("Ended");
        return;
      }

      const minsRemaining = differenceInMinutes(endTime, now);
      if (minsRemaining < 1) {
        setTimeRemaining("Ending soon");
      } else {
        setTimeRemaining(`Ends in ${minsRemaining} mins`);
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [session.endTime, session.startTime]);

  const handleBookmarkClick = () => {
    toggleBookmark(session.id);
    onBookmarkToggle(session.id);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:scale-[1.02] transition-all duration-200">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {session.title}
          </h3>
          <p className="text-gray-600 mt-1">{session.description}</p>
          <div className="flex items-center gap-2 text-sm text-purple-600 mt-2">
            <span>{format(new Date(session.startTime), "h:mm a")}</span>
            <span>•</span>
            <span>{session.endTime}</span>
            {session.location && (
              <>
                <span>•</span>
                <span>{session.location}</span>
              </>
            )}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryStyles(
                session.category
              )}`}
            >
              {session.category.charAt(0).toUpperCase() +
                session.category.slice(1)}
            </span>
            <span className="text-sm text-gray-500">{timeRemaining}</span>
          </div>
        </div>
        <button
          onClick={handleBookmarkClick}
          className="p-2 rounded-full hover:bg-pink-50 transition-colors group cursor-pointer"
        >
          {session.isBookmarked ? (
            <HeartIconSolid className="w-6 h-6 text-pink-500" />
          ) : (
            <HeartIcon className="w-6 h-6 text-gray-400 group-hover:text-pink-500 transition-colors" />
          )}
        </button>
      </div>
    </div>
  );
}

function getCategoryStyles(category: string): string {
  switch (category) {
    case "workshop":
      return "bg-orange-100 text-orange-800";
    case "social":
      return "bg-sky-100 text-sky-800";
    case "talk":
      return "bg-violet-100 text-violet-800";
    case "activity":
      return "bg-green-100 text-green-800";
    case "other":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-purple-100 text-purple-700";
  }
}
