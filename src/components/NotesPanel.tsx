import { type ChangeEvent, type KeyboardEvent, useEffect, useRef, useState } from 'react';

import { ICON_SIZE, KEYBOARD_KEYS, LABELS } from '../constants';
import { useStore } from '../store/useStore';
import type { Note } from '../types';
import { CloseIcon, PlusIcon } from './Icons';

import styles from './NotesPanel.module.css';

export function NotesPanel() {
    const notes = useStore((state) => state.notes);
    const addNote = useStore((state) => state.addNote);
    const updateNote = useStore((state) => state.updateNote);
    const deleteNote = useStore((state) => state.deleteNote);
    const [isAdding, setIsAdding] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editContent, setEditContent] = useState('');
    const editTextareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (editTextareaRef.current) {
            editTextareaRef.current.style.height = 'auto';
            editTextareaRef.current.style.height = `${editTextareaRef.current.scrollHeight}px`;
        }
    }, [editContent, editingId]);

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

    return (
        <div className={styles.panel}>
            {!isAdding ? (
                <button className={styles.addBtn} onClick={() => setIsAdding(true)}>
                    <PlusIcon size={ICON_SIZE.MD} />
                    {LABELS.ADD_NOTE}
                </button>
            ) : (
                <div className={styles.noteForm}>
                    <textarea
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
                    <div key={note.id} className={styles.noteCard}>
                        <button className={styles.deleteBtn} onClick={() => deleteNote(note.id)}>
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
        </div>
    );
}
