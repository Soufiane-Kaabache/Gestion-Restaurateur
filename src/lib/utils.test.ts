import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn (classNames + twMerge wrapper)', () => {
  it('merges simple class names', () => {
    expect(cn('p-2', 'bg-white')).toContain('p-2');
    expect(cn('p-2', 'bg-white')).toContain('bg-white');
  });

  it('deduplicates and merges conflicting classes (tailwind merge)', () => {
    const merged = cn('p-2 p-4', 'p-1');
    // twMerge should keep the last occurrence 'p-1'
    expect(merged).toContain('p-1');
    expect(merged).not.toContain('p-2');
    expect(merged).not.toContain('p-4');
  });
});
