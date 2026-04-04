import { sanitizePlayerProgress, defaultPlayerProgress } from '../../../src/storage/playerProgressStore.shared';

describe('sanitizePlayerProgress', () => {
  it('returns defaults when given an empty object', () => {
    const result = sanitizePlayerProgress({});
    expect(result).toEqual(defaultPlayerProgress);
  });
});
