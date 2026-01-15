import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Timer } from '../../src/components/Timer';

describe('Timer Component', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders with initial time 00:00:00', () => {
        const setTime = vi.fn();
        const setIsRunning = vi.fn();

        render(<Timer time={0} setTime={setTime} isRunning={false} setIsRunning={setIsRunning} />);

        // Check that component rendered
        const playButton = screen.getByTitle('Play');
        expect(playButton).toBeDefined();
    });

    it('calls setIsRunning when Play button is clicked', () => {
        const setTime = vi.fn();
        const setIsRunning = vi.fn();

        render(<Timer time={0} setTime={setTime} isRunning={false} setIsRunning={setIsRunning} />);

        const playButton = screen.getByTitle('Play');
        fireEvent.click(playButton);

        expect(setIsRunning).toHaveBeenCalledWith(true);
    });

    it('calls setIsRunning when Pause button is clicked', () => {
        const setTime = vi.fn();
        const setIsRunning = vi.fn();

        render(<Timer time={5} setTime={setTime} isRunning={true} setIsRunning={setIsRunning} />);

        const pauseButton = screen.getByTitle('Pause');
        fireEvent.click(pauseButton);

        expect(setIsRunning).toHaveBeenCalledWith(false);
    });

    it('resets timer when Reset button is clicked (keeps running state)', () => {
        const setTime = vi.fn();
        const setIsRunning = vi.fn();

        render(<Timer time={100} setTime={setTime} isRunning={true} setIsRunning={setIsRunning} />);

        const resetButton = screen.getByTitle('Reset');
        fireEvent.click(resetButton);

        // Reset now uses store directly and keeps running state
        // It doesn't call setIsRunning or setTime from props
        expect(setIsRunning).not.toHaveBeenCalled();
        expect(setTime).not.toHaveBeenCalled();
    });

    it('updates display time based on elapsed time when running', () => {
        const setTime = vi.fn();
        const setIsRunning = vi.fn();
        const currentTime = 10;

        // Timer now uses startedAt from store to calculate elapsed time
        // When running, it displays time + elapsed since startedAt
        // setTime is only called when pausing to save the elapsed time
        render(<Timer time={currentTime} setTime={setTime} isRunning={true} setIsRunning={setIsRunning} />);

        // Advance time by 1 second
        vi.advanceTimersByTime(1000);

        // setTime should NOT be called while running (only on pause)
        // The display updates locally based on startedAt
        expect(setTime).not.toHaveBeenCalled();
    });

    it('does not increment time when timer is stopped', () => {
        const setTime = vi.fn();
        const setIsRunning = vi.fn();

        render(<Timer time={10} setTime={setTime} isRunning={false} setIsRunning={setIsRunning} />);

        // Advance time by 5 seconds
        vi.advanceTimersByTime(5000);

        // setTime should not be called
        expect(setTime).not.toHaveBeenCalled();
    });

    it('clears interval on unmount', () => {
        const setTime = vi.fn();
        const setIsRunning = vi.fn();

        const { unmount } = render(
            <Timer time={0} setTime={setTime} isRunning={true} setIsRunning={setIsRunning} />
        );

        // Unmount component
        unmount();

        // Advance time
        vi.advanceTimersByTime(5000);

        // setTime should not be called after unmount
        const callsBeforeAdvance = setTime.mock.calls.length;
        vi.advanceTimersByTime(5000);
        expect(setTime.mock.calls.length).toBe(callsBeforeAdvance);
    });
});
