import { type ChangeEvent, type KeyboardEvent, useRef, useState } from 'react';

import { ICON_SIZE, KEYBOARD_KEYS } from '../constants';
import { useStore } from '../store/useStore';
import type { TodoListNote } from '../types';
import { CheckboxCheckedIcon, CheckboxIcon, CloseIcon, PlusIcon } from './Icons';

import styles from './TodoListCard.module.css';

interface TodoListCardProps {
    note: TodoListNote;
    color: string;
    isDeleting: boolean;
    onDelete: () => void;
}

export function TodoListCard({ note, color, isDeleting, onDelete }: TodoListCardProps) {
    const updateTodoListTitle = useStore((state) => state.updateTodoListTitle);
    const addTodoItem = useStore((state) => state.addTodoItem);
    const toggleTodoItem = useStore((state) => state.toggleTodoItem);
    const updateTodoItem = useStore((state) => state.updateTodoItem);
    const deleteTodoItem = useStore((state) => state.deleteTodoItem);

    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState(note.title);
    const [editingItemId, setEditingItemId] = useState<number | null>(null);
    const [editedItemText, setEditedItemText] = useState('');
    const [isAddingItem, setIsAddingItem] = useState(false);
    const [newItemText, setNewItemText] = useState('');

    const titleInputRef = useRef<HTMLInputElement>(null);
    const itemInputRef = useRef<HTMLInputElement>(null);
    const newItemInputRef = useRef<HTMLInputElement>(null);

    const startEditTitle = () => {
        setIsEditingTitle(true);
        setEditedTitle(note.title);
        setTimeout(() => titleInputRef.current?.focus(), 0);
    };

    const saveTitle = () => {
        if (editedTitle.trim() !== note.title) {
            updateTodoListTitle(note.id, editedTitle.trim());
        }
        setIsEditingTitle(false);
    };

    const cancelEditTitle = () => {
        setEditedTitle(note.title);
        setIsEditingTitle(false);
    };

    const handleTitleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === KEYBOARD_KEYS.ENTER) {
            e.preventDefault();
            saveTitle();
        }
        if (e.key === KEYBOARD_KEYS.ESCAPE) {
            cancelEditTitle();
        }
    };

    const startEditItem = (itemId: number, text: string) => {
        setEditingItemId(itemId);
        setEditedItemText(text);
        setTimeout(() => itemInputRef.current?.focus(), 0);
    };

    const saveItem = () => {
        if (editingItemId !== null && editedItemText.trim()) {
            updateTodoItem(note.id, editingItemId, editedItemText.trim());
        }
        setEditingItemId(null);
        setEditedItemText('');
    };

    const cancelEditItem = () => {
        setEditingItemId(null);
        setEditedItemText('');
    };

    const handleItemKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === KEYBOARD_KEYS.ENTER) {
            e.preventDefault();
            saveItem();
        }
        if (e.key === KEYBOARD_KEYS.ESCAPE) {
            cancelEditItem();
        }
    };

    const handleAddItem = () => {
        if (newItemText.trim()) {
            addTodoItem(note.id, newItemText.trim());
            setNewItemText('');
            setTimeout(() => newItemInputRef.current?.focus(), 0);
        }
    };

    const handleNewItemKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === KEYBOARD_KEYS.ENTER) {
            e.preventDefault();
            handleAddItem();
        }
        if (e.key === KEYBOARD_KEYS.ESCAPE) {
            setNewItemText('');
            setIsAddingItem(false);
        }
    };

    return (
        <div
            className={`${styles.card} ${isDeleting ? styles.deleting : ''}`}
            style={{ '--note-color': color } as React.CSSProperties}>
            <button className={styles.deleteBtn} onClick={onDelete}>
                <CloseIcon size={ICON_SIZE.SM} />
            </button>

            {note.title && (
                <div className={styles.titleWrapper}>
                    {isEditingTitle ? (
                        <input
                            ref={titleInputRef}
                            type='text'
                            className={styles.titleInput}
                            value={editedTitle}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEditedTitle(e.target.value)}
                            onKeyDown={handleTitleKeyDown}
                            onBlur={saveTitle}
                        />
                    ) : (
                        <h3 className={styles.title} onClick={startEditTitle}>
                            {note.title}
                        </h3>
                    )}
                </div>
            )}

            <div className={styles.itemsList}>
                {note.items.map((item) => (
                    <div key={item.id} className={styles.todoItem}>
                        <button
                            className={styles.checkbox}
                            onClick={() => toggleTodoItem(note.id, item.id)}
                            aria-label={item.completed ? 'Mark as incomplete' : 'Mark as complete'}>
                            {item.completed ? (
                                <CheckboxCheckedIcon size={ICON_SIZE.MD} />
                            ) : (
                                <CheckboxIcon size={ICON_SIZE.MD} />
                            )}
                        </button>

                        {editingItemId === item.id ? (
                            <input
                                ref={itemInputRef}
                                type='text'
                                className={styles.itemInput}
                                value={editedItemText}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setEditedItemText(e.target.value)}
                                onKeyDown={handleItemKeyDown}
                                onBlur={saveItem}
                            />
                        ) : (
                            <span
                                className={`${styles.itemText} ${item.completed ? styles.completed : ''}`}
                                onClick={() => startEditItem(item.id, item.text)}>
                                {item.text}
                            </span>
                        )}

                        <button
                            className={styles.deleteItemBtn}
                            onClick={() => deleteTodoItem(note.id, item.id)}
                            aria-label='Delete item'>
                            <CloseIcon size={ICON_SIZE.XS} />
                        </button>
                    </div>
                ))}

                {isAddingItem ? (
                    <div className={styles.todoItem}>
                        <div className={styles.checkbox}>
                            <CheckboxIcon size={ICON_SIZE.MD} />
                        </div>
                        <input
                            ref={newItemInputRef}
                            type='text'
                            className={styles.itemInput}
                            value={newItemText}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewItemText(e.target.value)}
                            onKeyDown={handleNewItemKeyDown}
                            onBlur={() => {
                                if (newItemText.trim()) {
                                    handleAddItem();
                                } else {
                                    setIsAddingItem(false);
                                }
                            }}
                            placeholder='Enter todo item...'
                            autoFocus
                        />
                    </div>
                ) : (
                    <button
                        className={styles.addItemBtn}
                        onClick={() => {
                            setIsAddingItem(true);
                            setTimeout(() => newItemInputRef.current?.focus(), 0);
                        }}>
                        <PlusIcon size={ICON_SIZE.SM} />
                        <span>Add item</span>
                    </button>
                )}
            </div>
        </div>
    );
}
