import { Session } from "@/types/session";
import { format, addHours } from "date-fns";

interface NowHappeningBannerProps {
  currentSessions: Session[];
  upcomingSessions: Session[];
}

export default function NowHappeningBanner({
  currentSessions,
  upcomingSessions,
}: NowHappeningBannerProps) {
  if (currentSessions.length === 0 && upcomingSessions.length === 0)
    return null;

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-8 border border-purple-100 shadow-sm relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-100/20 to-pink-100/20 animate-pulse"></div>
      <div className="relative">
        {currentSessions.length > 0 && (
          <>
            <h2 className="text-lg font-semibold text-purple-900 mb-4 flex items-center gap-2">
              <span className="animate-pulse">✨</span> Now Happening
            </h2>
            <div className="space-y-4 mb-6">
              {currentSessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-purple-50 hover:border-purple-100 transition-all duration-300"
                >
                  <h3 className="font-medium text-gray-900">{session.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {session.description}
                  </p>
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
                </div>
              ))}
            </div>
          </>
        )}

        {upcomingSessions.length > 0 && (
          <>
            <h2 className="text-lg font-semibold text-purple-900 mb-4 flex items-center gap-2">
              <span className="text-purple-400">⏳</span> Coming Up Next
            </h2>
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-purple-50 hover:border-purple-100 transition-all duration-300"
                >
                  <h3 className="font-medium text-gray-900">{session.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {session.description}
                  </p>
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
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
