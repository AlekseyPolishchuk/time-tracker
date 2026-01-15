import { type ChangeEvent, type KeyboardEvent, useRef, useState } from 'react';

import { ICON_SIZE, KEYBOARD_KEYS, LABELS } from '../constants';
import { useStore } from '../store/useStore';
import type { TodoItem } from '../types';
import { CloseIcon, PlusIcon } from './Icons';

import styles from './TodoListForm.module.css';

interface TodoListFormProps {
    onCancel: () => void;
}

export function TodoListForm({ onCancel }: TodoListFormProps) {
    const addTodoList = useStore((state) => state.addTodoList);
    const [title, setTitle] = useState('');
    const [items, setItems] = useState<string[]>(['']);
    const titleInputRef = useRef<HTMLInputElement>(null);
    const itemInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleAddItem = () => {
        setItems([...items, '']);
        // Focus the new input after it's rendered
        setTimeout(() => {
            itemInputRefs.current[items.length]?.focus();
        }, 0);
    };

    const handleRemoveItem = (index: number) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const handleItemChange = (index: number, value: string) => {
        const newItems = [...items];
        newItems[index] = value;
        setItems(newItems);
    };

    const handleItemKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === KEYBOARD_KEYS.ENTER) {
            e.preventDefault();
            if (items[index].trim()) {
                handleAddItem();
            } else if (index === items.length - 1 && items.length > 1) {
                // If last item is empty and there are other items, save
                handleSave();
            }
        }
        if (e.key === KEYBOARD_KEYS.ESCAPE) {
            onCancel();
        }
    };

    const handleTitleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === KEYBOARD_KEYS.ENTER) {
            e.preventDefault();
            itemInputRefs.current[0]?.focus();
        }
        if (e.key === KEYBOARD_KEYS.ESCAPE) {
            onCancel();
        }
    };

    const handleSave = () => {
        const validItems = items.filter((item) => item.trim());
        if (validItems.length === 0) {
            return;
        }

        const todoItems: TodoItem[] = validItems.map((text, index) => ({
            id: Date.now() + index,
            text: text.trim(),
            completed: false
        }));

        addTodoList(title.trim(), todoItems);
        onCancel();
    };

    const canSave = items.some((item) => item.trim());

    return (
        <div className={styles.form}>
            <input
                ref={titleInputRef}
                type='text'
                className={styles.titleInput}
                placeholder={LABELS.TODO_TITLE_PLACEHOLDER}
                value={title}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                onKeyDown={handleTitleKeyDown}
                autoFocus
            />

            <div className={styles.itemsList}>
                {items.map((item, index) => (
                    <div key={index} className={styles.itemRow}>
                        <input
                            ref={(el) => (itemInputRefs.current[index] = el)}
                            type='text'
                            className={styles.itemInput}
                            placeholder={LABELS.TODO_PLACEHOLDER}
                            value={item}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleItemChange(index, e.target.value)}
                            onKeyDown={(e) => handleItemKeyDown(e, index)}
                        />
                        {items.length > 1 && (
                            <button
                                className={styles.removeBtn}
                                onClick={() => handleRemoveItem(index)}
                                type='button'
                                aria-label='Remove item'>
                                <CloseIcon size={ICON_SIZE.XS} />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <button className={styles.addItemBtn} onClick={handleAddItem} type='button'>
                <PlusIcon size={ICON_SIZE.SM} />
                {LABELS.ADD_TODO_ITEM}
            </button>

            <div className={styles.formActions}>
                <button className={styles.cancelBtn} onClick={onCancel} type='button'>
                    {LABELS.CANCEL_BTN}
                </button>
                <button className={styles.saveBtn} onClick={handleSave} disabled={!canSave} type='button'>
                    {LABELS.SAVE_BTN}
                </button>
            </div>
        </div>
    );
}
