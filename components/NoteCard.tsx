'use client';

import { motion } from 'framer-motion';
import { Note } from '@/lib/store';
import { Trash2, Edit2 } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
}

export default function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const truncateText = (text: string, lines: number = 3) => {
    const lineArray = text.split('\n');
    if (lineArray.length > lines) {
      return lineArray.slice(0, lines).join('\n') + '...';
    }
    return text.length > 150 ? text.substring(0, 150) + '...' : text;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition border border-gray-200 p-5 flex flex-col cursor-pointer group"
      onClick={onEdit}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800 flex-1 break-words line-clamp-2">
          {note.title}
        </h3>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition ml-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 hover:bg-red-50 text-red-500 rounded transition"
            title="Delete note"
          >
            <Trash2 size={18} />
          </motion.button>
        </div>
      </div>

      <p className="text-gray-600 text-sm flex-1 mb-4 whitespace-pre-wrap break-words">
        {truncateText(note.content)}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs text-gray-500">
        <span>Last modified: {formatDate(note.last_update)}</span>
      </div>
    </motion.div>
  );
}
