# 🧪 Tests

This project uses **Vitest** for testing.

## 📦 What's Installed

- `vitest` - test runner (fast alternative to Jest)
- `@testing-library/react` - for testing React components
- `@testing-library/jest-dom` - additional matchers (toBeInTheDocument etc)
- `jsdom` - browser DOM emulation

## 🏃 Commands

```bash
# Run all tests once
npm test -- --run

# Watch mode - tests rerun on changes
npm test

# UI mode - nice visual interface
npm run test:ui

# Coverage - how much code is covered by tests
npm run test:coverage
```

## 📁 Test Structure

```
tests/
  setup.ts              # Setup for all tests
  utils/                # Tests for utility functions
    formatTime.test.ts
    formatWeeklyTime.test.ts
    getDayLabel.test.ts
  store/                # Tests for Zustand store
    useStore.test.ts
```

## ✅ Coverage

Current tests cover:

### Utility functions (100%)
- ✅ `formatTime` - 6 tests
- ✅ `formatWeeklyTime` - 6 tests
- ✅ `getDayLabel` - 4 tests

### Zustand Store (100%)
- ✅ Trackers (7 tests)
  - Adding tracker
  - Updating tracker
  - Deleting tracker
  - Clearing all trackers
- ✅ Notes (4 tests)
  - Adding note
  - Updating note
  - Deleting note
- ✅ Timer (3 tests)
  - Setting time
  - Start/stop
  - Reset
- ✅ Integration (2 tests)
  - Complete workflow of creating tracker
  - Adding multiple trackers

**Total: 32 tests**

## 📝 How to Write Tests

### Test for utility function

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '../../src/utils/myFunction';

describe('myFunction', () => {
    it('does something correctly', () => {
        const result = myFunction(input);
        expect(result).toBe(expectedOutput);
    });
});
```

### Test for Zustand store

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../../src/store/useStore';

describe('My Store Feature', () => {
    beforeEach(() => {
        // Clear store before each test
        useStore.setState({ /* initial state */ });
    });

    it('executes action correctly', () => {
        useStore.getState().myAction('param');

        const result = useStore.getState().someValue;
        expect(result).toBe('expected');
    });
});
```

### Test for React component

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MyComponent } from '../../src/components/MyComponent';

describe('MyComponent', () => {
    it('renders correctly', () => {
        render(<MyComponent />);

        expect(screen.getByText('Hello')).toBeInTheDocument();
    });

    it('responds to click', () => {
        render(<MyComponent />);

        fireEvent.click(screen.getByRole('button'));

        expect(screen.getByText('Clicked')).toBeInTheDocument();
    });
});
```

## 🎯 Why Vitest?

1. **Speed** ⚡
   - Runs in 0.5-1 second
   - Jest takes 5-10 seconds

2. **Integration with Vite**
   - Uses the same config
   - No additional setup needed

3. **TypeScript & ESM**
   - Works out of the box
   - No babel needed

4. **Compatible with Jest**
   - Same API
   - Same matchers

5. **UI Mode**
   - Visual interface for tests
   - Easy to debug

## 📚 Useful Matchers

```typescript
// Equality
expect(value).toBe(5);
expect(value).toEqual({ name: 'Test' });

// Boolean
expect(value).toBeTruthy();
expect(value).toBeFalsy();

// Numbers
expect(value).toBeGreaterThan(10);
expect(value).toBeLessThan(100);

// Arrays/Objects
expect(array).toHaveLength(3);
expect(array).toContain(item);
expect(obj).toHaveProperty('key');

// DOM (from @testing-library/jest-dom)
expect(element).toBeInTheDocument();
expect(element).toBeVisible();
expect(element).toHaveTextContent('Hello');
```

## 🐛 Debugging Tests

```typescript
// Print current state
console.log(useStore.getState());

// Print DOM
import { screen } from '@testing-library/react';
screen.debug();

// Run only one test
it.only('this test', () => { ... });

// Skip test
it.skip('this test', () => { ... });
```

## 🎉 Result

All tests pass in ~1 second:

```
✓ tests/utils/formatTime.test.ts (6 tests)
✓ tests/utils/formatWeeklyTime.test.ts (6 tests)
✓ tests/utils/getDayLabel.test.ts (4 tests)
✓ tests/store/useStore.test.ts (16 tests)

Test Files  4 passed (4)
     Tests  32 passed (32)
  Duration  918ms
```
