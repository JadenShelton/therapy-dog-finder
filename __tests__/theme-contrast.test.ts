import { universities } from '../src/config/universities';
import { MIN_TEXT_CONTRAST, contrast } from '../src/theme/contrast';
import { textPairs } from '../src/theme/tokens';

describe('text/background token pairs', () => {
  for (const u of universities) {
    for (const [fg, bg] of textPairs) {
      it(`${u.id}: ${fg} on ${bg} >= ${MIN_TEXT_CONTRAST}:1`, () => {
        expect(contrast(u.theme[fg], u.theme[bg])).toBeGreaterThanOrEqual(MIN_TEXT_CONTRAST);
      });
    }
  }

  it('CSU gold is never a text color on a light background', () => {
    const csu = universities.find((u) => u.id === 'csu')!;
    const gold = csu.theme.secondary;
    for (const key of ['text', 'textMuted', 'primary', 'onPrimary', 'onSecondary'] as const) {
      if (csu.theme[key].toLowerCase() === gold.toLowerCase()) {
        expect(contrast(gold, csu.theme.background)).toBeGreaterThanOrEqual(MIN_TEXT_CONTRAST);
      }
    }
    expect(textPairs.some(([fg]) => csu.theme[fg] === gold)).toBe(false);
  });

  it('registry ids are unique', () => {
    expect(new Set(universities.map((u) => u.id)).size).toBe(universities.length);
  });
});
