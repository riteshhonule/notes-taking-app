'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, useNotes, type Note } from '@/lib/store';
import { notesAPI } from '@/lib/api';
import Header from '@/components/Header';
import NoteCard from '@/components/NoteCard';
import NoteModal from '@/components/NoteModal';
import { Trash2, Plus } from 'lucide-react';

export default function NotesPage() {
  const router = useRouter();
  const { token, user, logout } = useAuth();
  const { notes, setNotes, addNote, updateNote, deleteNote } = useNotes();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      router.push('/auth/signin');
      return;
    }

    fetchNotes();
  }, [token, router]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await notesAPI.getAll();
      setNotes(response.data.notes || []);
    } catch (err: any) {
      if (err.response?.status === 401) {
        logout();
        router.push('/auth/signin');
      } else {
        setError('Failed to load notes');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async (title: string, content: string) => {
    try {
      const response = await notesAPI.create({
        note_title: title,
        note_content: content,
      });
      addNote(response.data);
      setShowModal(false);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create note');
    }
  };

  const handleUpdateNote = async (id: string, title: string, content: string) => {
    try {
      const response = await notesAPI.update(id, {
        note_title: title,
        note_content: content,
      });
      updateNote(response.data);
      setEditingNote(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update note');
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      await notesAPI.delete(id);
      deleteNote(id);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete note');
    }
  };

  const greeting = getGreeting();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-4xl font-bold text-gray-800">
            {greeting} {user?.user_name}!
          </h2>
          <p className="text-gray-600 mt-2">
            You have {notes.length} {notes.length === 1 ? 'note' : 'notes'}
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6"
          >
            {error}
            <button
              onClick={() => setError('')}
              className="float-right text-sm underline"
            >
              Dismiss
            </button>
          </motion.div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
          </div>
        ) : notes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-600 text-lg mb-6">
              No notes yet. Create your first note!
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition flex items-center gap-2 mx-auto"
            >
              <Plus size={20} /> Create Note
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {notes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <NoteCard
                    note={note}
                    onEdit={() => setEditingNote(note)}
                    onDelete={() => handleDeleteNote(note.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <motion.button
          onClick={() => {
            setEditingNote(null);
            setShowModal(true);
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-8 right-8 w-16 h-16 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl transition"
        >
          <Plus size={24} />
        </motion.button>
      </main>

      <AnimatePresence>
        {(showModal || editingNote) && (
          <NoteModal
            note={editingNote}
            onSave={(title, content) => {
              if (editingNote) {
                handleUpdateNote(editingNote.id, title, content);
              } else {
                handleCreateNote(title, content);
              }
            }}
            onClose={() => {
              setShowModal(false);
              setEditingNote(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}
