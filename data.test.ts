import { describe, it, expect } from 'vitest';
import { MATCHES_DATA } from './src/data';

describe('Data', () => {
  it('exports correct structures', () => {
    expect(MATCHES_DATA).toBeInstanceOf(Array);
  });
});
