import fs from 'fs';
import path from 'path';

const root = path.resolve(__dirname, '..');
const HEX = /#[0-9a-fA-F]{3,8}\b/;

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : /\.(ts|tsx|js|jsx)$/.test(e.name) ? [p] : [];
  });
}

describe('no hex color literals outside src/config and src/theme', () => {
  const files = [...walk(path.join(root, 'app')), ...walk(path.join(root, 'src/components'))];

  it('scans some files', () => expect(files.length).toBeGreaterThan(0));

  it.each(files.map((f) => [path.relative(root, f), f]))('%s', (_rel, file) => {
    const offending = fs
      .readFileSync(file, 'utf8')
      .split('\n')
      .map((line, i) => ({ line, n: i + 1 }))
      .filter(({ line }) => HEX.test(line));
    expect(offending).toEqual([]);
  });
});
