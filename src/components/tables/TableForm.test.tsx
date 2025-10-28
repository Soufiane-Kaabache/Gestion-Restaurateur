import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('TableForm static check', () => {
  it('does not contain a SelectItem with an empty value in source', () => {
    const filePath = path.join(process.cwd(), 'src/components/tables/TableForm.tsx');
    const src = fs.readFileSync(filePath, 'utf8');
    // ensure there is no SelectItem value="" usage
    expect(src).not.toMatch(/SelectItem\s+[^>]*value\s*=\s*["']\s*["']/);
  });
});
