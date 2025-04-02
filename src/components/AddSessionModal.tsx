import { useState } from "react";
import { Session, SessionCategory } from "@/types/session";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface AddSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (session: Omit<Session, "id">) => void;
}

export default function AddSessionModal({
  isOpen,
  onClose,
  onAdd,
}: AddSessionModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [category, setCategory] = useState<SessionCategory>("workshop");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      title,
      description,
      startTime,
      endTime,
      category,
      isBookmarked: false,
    });
    setTitle("");
    setDescription("");
    setStartTime("");
    setEndTime("");
    setCategory("workshop");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Add New Session
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
              rows={3}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="input-field"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as SessionCategory)}
              className="input-field"
            >
              <option value="workshop">Workshop</option>
              <option value="social">Social</option>
              <option value="talk">Talk</option>
              <option value="activity">Activity</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
