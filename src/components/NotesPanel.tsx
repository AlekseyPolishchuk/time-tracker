import { type ChangeEvent, type KeyboardEvent, useEffect, useRef, useState } from 'react';

import { ICON_SIZE, KEYBOARD_KEYS, LABELS } from '../constants';
import { useStore } from '../store/useStore';
import type { Note } from '../types';
import { CloseIcon, DeleteIcon, PlusIcon } from './Icons';
import { ConfirmDialog } from './ConfirmDialog';

import styles from './NotesPanel.module.css';

const NOTE_COLORS = [
    '#3B4A7A', // indigo
    '#50377A', // violet
    '#8B4A6F', // pink
    '#9B4444', // red
    '#B5613C', // orange
    '#9B864A', // yellow
    '#4A7A5E', // green
    '#4A7A8B', // cyan
    '#4A6A8B', // blue
    '#5E4A7A', // purple
];

function getColorForNote(id: number): string {
    return NOTE_COLORS[id % NOTE_COLORS.length];
}

export function NotesPanel() {
    const notes = useStore((state) => state.notes);
    const addNote = useStore((state) => state.addNote);
    const updateNote = useStore((state) => state.updateNote);
    const deleteNote = useStore((state) => state.deleteNote);
    const clearAllNotes = useStore((state) => state.clearAllNotes);
    const [isAdding, setIsAdding] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editContent, setEditContent] = useState('');
    const [showClearDialog, setShowClearDialog] = useState(false);
    const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
    const editTextareaRef = useRef<HTMLTextAreaElement>(null);
    const newNoteTextareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (editTextareaRef.current) {
            editTextareaRef.current.style.height = 'auto';
            editTextareaRef.current.style.height = `${editTextareaRef.current.scrollHeight}px`;
        }
    }, [editContent, editingId]);

    useEffect(() => {
        if (newNoteTextareaRef.current) {
            newNoteTextareaRef.current.style.height = 'auto';
            newNoteTextareaRef.current.style.height = `${newNoteTextareaRef.current.scrollHeight}px`;
        }
    }, [newNote]);

    const handleAdd = () => {
        if (newNote.trim()) {
            addNote(newNote.trim());
            setNewNote('');
            setIsAdding(false);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === KEYBOARD_KEYS.ENTER && !e.shiftKey) {
            e.preventDefault();
            handleAdd();
        }
        if (e.key === KEYBOARD_KEYS.ESCAPE) {
            handleCancel();
        }
    };

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setNewNote(e.target.value);
    };

    const handleCancel = () => {
        setNewNote('');
        setIsAdding(false);
    };

    const startEdit = (note: Note) => {
        setEditingId(note.id);
        setEditContent(note.content);
    };

    const handleEditChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setEditContent(e.target.value);
    };

    const handleEditKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === KEYBOARD_KEYS.ENTER && !e.shiftKey) {
            e.preventDefault();
            saveEdit();
        }
        if (e.key === KEYBOARD_KEYS.ESCAPE) {
            cancelEdit();
        }
    };

    const saveEdit = () => {
        if (editingId !== null && editContent.trim()) {
            updateNote(editingId, editContent.trim());
        }
        setEditingId(null);
        setEditContent('');
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditContent('');
    };

    const handleDeleteNote = (id: number) => {
        // Mark note as deleting
        setDeletingIds(prev => new Set(prev).add(id));

        // Wait for animation to complete, then actually delete
        setTimeout(() => {
            deleteNote(id);
            setDeletingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
        }, 300); // Match animation duration
    };

    const handleClearAll = () => {
        clearAllNotes();
        setShowClearDialog(false);
    };

    return (
        <div className={styles.panel}>
            <div className={styles.topActions}>
                {!isAdding ? (
                    <button className={styles.addBtn} onClick={() => setIsAdding(true)}>
                        <PlusIcon size={ICON_SIZE.MD} />
                        {LABELS.ADD_NOTE}
                    </button>
                ) : null}

                {notes.length > 0 && !isAdding && (
                    <button className={styles.clearBtn} onClick={() => setShowClearDialog(true)}>
                        <DeleteIcon size={ICON_SIZE.SM} />
                        {LABELS.CLEAR_ALL_NOTES}
                    </button>
                )}
            </div>

            {isAdding && (
                <div className={styles.noteForm}>
                    <textarea
                        ref={newNoteTextareaRef}
                        className={styles.textarea}
                        placeholder={LABELS.NOTE_PLACEHOLDER}
                        value={newNote}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        autoFocus
                    />
                    <div className={styles.formActions}>
                        <button className={styles.cancelBtn} onClick={handleCancel}>
                            {LABELS.CANCEL_BTN}
                        </button>
                        <button className={styles.saveBtn} onClick={handleAdd} disabled={!newNote.trim()}>
                            {LABELS.SAVE_BTN}
                        </button>
                    </div>
                </div>
            )}

            <div className={styles.notesList}>
                {notes.map(note => (
                    <div
                        key={note.id}
                        className={`${styles.noteCard} ${deletingIds.has(note.id) ? styles.deleting : ''}`}
                        style={{ '--note-color': getColorForNote(note.id) } as React.CSSProperties}
                    >
                        <button className={styles.deleteBtn} onClick={() => handleDeleteNote(note.id)}>
                            <CloseIcon size={ICON_SIZE.SM} />
                        </button>
                        {editingId === note.id ? (
                            <textarea
                                ref={editTextareaRef}
                                className={styles.editTextarea}
                                value={editContent}
                                onChange={handleEditChange}
                                onKeyDown={handleEditKeyDown}
                                onBlur={saveEdit}
                                autoFocus
                            />
                        ) : (
                            <p className={styles.noteContent} onClick={() => startEdit(note)}>
                                {note.content}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            <ConfirmDialog
                isOpen={showClearDialog}
                title={LABELS.CONFIRM_CLEAR_NOTES_TITLE}
                message={LABELS.CONFIRM_CLEAR_NOTES_MESSAGE}
                confirmLabel={LABELS.CLEAR_ALL}
                cancelLabel={LABELS.CANCEL_BTN}
                onConfirm={handleClearAll}
                onCancel={() => setShowClearDialog(false)}
            />
        </div>
    );
}
