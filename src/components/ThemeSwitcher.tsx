import { useStore, type Theme } from '../store/useStore';

import styles from './ThemeSwitcher.module.css';

const THEMES: { value: Theme; label: string }[] = [
    { value: 'darkest', label: 'Darkest' },
    { value: 'night', label: 'Night' }
];

export function ThemeSwitcher() {
    const theme = useStore((state) => state.theme);
    const setTheme = useStore((state) => state.setTheme);

    return (
        <select className={styles.select} value={theme} onChange={(e) => setTheme(e.target.value as Theme)}>
            {THEMES.map((t) => (
                <option key={t.value} value={t.value}>
                    {t.label}
                </option>
            ))}
        </select>
    );
}
