import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

const mockFetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ transcript: [] }),
    ok: true,
  } as Response)
);

global.fetch = mockFetch;
