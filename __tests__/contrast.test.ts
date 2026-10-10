import { contrast } from '../src/theme/contrast';

describe('contrast', () => {
  it('black on white is 21', () => expect(contrast('#000000', '#FFFFFF')).toBeCloseTo(21, 5));
  it('same color is 1', () => expect(contrast('#1E4D2B', '#1E4D2B')).toBeCloseTo(1, 5));
  it('is symmetric', () => expect(contrast('#BE0000', '#FFFFFF')).toBeCloseTo(contrast('#FFFFFF', '#BE0000'), 10));
  it('accepts 3-digit hex', () => expect(contrast('#000', '#fff')).toBeCloseTo(21, 5));
  it('matches known value (#777 on white = 4.48)', () => expect(contrast('#777777', '#FFFFFF')).toBeCloseTo(4.48, 2));
  it('rejects invalid hex', () => expect(() => contrast('red', '#fff')).toThrow());
});
