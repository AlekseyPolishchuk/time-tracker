import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../../src/store/useStore';

describe('Zustand Store', () => {
    // Clear store before each test
    beforeEach(() => {
        useStore.setState({
            trackers: [],
            notes: [],
            currentTime: 0,
            isRunning: false
        });
    });

    describe('Trackers', () => {
        it('adds new tracker', () => {
            const { addTracker } = useStore.getState();

            addTracker('My task');

            const trackers = useStore.getState().trackers;
            expect(trackers).toHaveLength(1);
            expect(trackers[0].name).toBe('My task');
            expect(trackers[0].time).toBe(0); // Time was reset
        });

        it('adds tracker with currentTime and resets it', () => {
            useStore.setState({ currentTime: 100 });

            const { addTracker } = useStore.getState();
            addTracker('Test Task');

            const trackers = useStore.getState().trackers;
            expect(trackers[0].time).toBe(100); // Saved time
            expect(useStore.getState().currentTime).toBe(0); // Reset currentTime
        });

        it('resets isRunning after adding tracker', () => {
            useStore.setState({ isRunning: true });

            const { addTracker } = useStore.getState();
            addTracker('Test');

            expect(useStore.getState().isRunning).toBe(false);
        });

        it('updates existing tracker', () => {
            useStore.setState({
                trackers: [{ id: 1, name: 'Old Name', time: 100, createdAt: '2024-01-01' }]
            });

            const { updateTracker } = useStore.getState();
            updateTracker(1, { name: 'New Name' });

            const trackers = useStore.getState().trackers;
            expect(trackers[0].name).toBe('New Name');
            expect(trackers[0].time).toBe(100); // Other fields unchanged
        });

        it('updates tracker time', () => {
            useStore.setState({
                trackers: [{ id: 1, name: 'Task', time: 100, createdAt: '2024-01-01' }]
            });

            const { updateTracker } = useStore.getState();
            updateTracker(1, { time: 200 });

            const trackers = useStore.getState().trackers;
            expect(trackers[0].time).toBe(200);
            expect(trackers[0].name).toBe('Task'); // Other fields unchanged
        });

        it('deletes tracker', () => {
            useStore.setState({
                trackers: [
                    { id: 1, name: 'Task 1', time: 100, createdAt: '2024-01-01' },
                    { id: 2, name: 'Task 2', time: 200, createdAt: '2024-01-02' }
                ]
            });

            const { deleteTracker } = useStore.getState();
            deleteTracker(1);

            const trackers = useStore.getState().trackers;
            expect(trackers).toHaveLength(1);
            expect(trackers[0].id).toBe(2);
        });

        it('clears all trackers', () => {
            useStore.setState({
                trackers: [
                    { id: 1, name: 'Task 1', time: 100, createdAt: '2024-01-01' },
                    { id: 2, name: 'Task 2', time: 200, createdAt: '2024-01-02' }
                ]
            });

            const { clearAllTrackers } = useStore.getState();
            clearAllTrackers();

            expect(useStore.getState().trackers).toHaveLength(0);
        });
    });

    describe('Notes', () => {
        it('adds new note', () => {
            const { addNote } = useStore.getState();

            addNote('My note');

            const notes = useStore.getState().notes;
            expect(notes).toHaveLength(1);
            expect(notes[0].content).toBe('My note');
            expect(notes[0]).toHaveProperty('id');
            expect(notes[0]).toHaveProperty('createdAt');
        });

        it('adds notes in LIFO order (last added at the beginning)', () => {
            const { addNote } = useStore.getState();

            addNote('First');
            addNote('Second');
            addNote('Third');

            const notes = useStore.getState().notes;
            expect(notes[0].content).toBe('Third');
            expect(notes[1].content).toBe('Second');
            expect(notes[2].content).toBe('First');
        });

        it('updates note', () => {
            useStore.setState({
                notes: [{ id: 1, content: 'Old content', createdAt: '2024-01-01' }]
            });

            const { updateNote } = useStore.getState();
            updateNote(1, 'New content');

            const notes = useStore.getState().notes;
            expect(notes[0].content).toBe('New content');
        });

        it('deletes note', () => {
            useStore.setState({
                notes: [
                    { id: 1, content: 'Note 1', createdAt: '2024-01-01' },
                    { id: 2, content: 'Note 2', createdAt: '2024-01-02' }
                ]
            });

            const { deleteNote } = useStore.getState();
            deleteNote(1);

            const notes = useStore.getState().notes;
            expect(notes).toHaveLength(1);
            expect(notes[0].id).toBe(2);
        });
    });

    describe('Timer', () => {
        it('sets current time', () => {
            const { setCurrentTime } = useStore.getState();

            setCurrentTime(100);

            expect(useStore.getState().currentTime).toBe(100);
        });

        it('sets running state', () => {
            const { setIsRunning } = useStore.getState();

            setIsRunning(true);
            expect(useStore.getState().isRunning).toBe(true);

            setIsRunning(false);
            expect(useStore.getState().isRunning).toBe(false);
        });

        it('resets timer', () => {
            useStore.setState({ currentTime: 100, isRunning: true });

            const { resetTimer } = useStore.getState();
            resetTimer();

            expect(useStore.getState().currentTime).toBe(0);
            expect(useStore.getState().isRunning).toBe(false);
        });
    });

    describe('Integration scenarios', () => {
        it('user creates and saves tracker with time', () => {
            // Start timer
            useStore.getState().setIsRunning(true);
            useStore.getState().setCurrentTime(100);

            // Save tracker
            useStore.getState().addTracker('My Task');

            // Check result
            const state = useStore.getState();
            expect(state.trackers).toHaveLength(1);
            expect(state.trackers[0].name).toBe('My Task');
            expect(state.trackers[0].time).toBe(100);
            expect(state.currentTime).toBe(0); // Reset
            expect(state.isRunning).toBe(false); // Stopped
        });

        it('user adds multiple trackers in a row', () => {
            // Add 3 trackers
            useStore.getState().setCurrentTime(100);
            useStore.getState().addTracker('Task 1');

            useStore.getState().setCurrentTime(200);
            useStore.getState().addTracker('Task 2');

            useStore.getState().setCurrentTime(300);
            useStore.getState().addTracker('Task 3');

            // Check result
            const trackers = useStore.getState().trackers;
            expect(trackers).toHaveLength(3);
            // LIFO order - last added at the beginning
            expect(trackers[0].name).toBe('Task 3');
            expect(trackers[0].time).toBe(300);
            expect(trackers[1].name).toBe('Task 2');
            expect(trackers[1].time).toBe(200);
            expect(trackers[2].name).toBe('Task 1');
            expect(trackers[2].time).toBe(100);
        });
    });
});
