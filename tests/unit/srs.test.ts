import { describe, it, expect, beforeEach } from 'vitest';
import { loadStats, saveStats, sm2 } from '../../src/srs.js';

describe('SRS Logic (Spaced Repetition)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize empty stats', () => {
    const stats = loadStats();
    expect(stats.streak).toBe(0);
    expect(stats.totalToday).toBe(0);
  });

  it('should save and load stats correctly', () => {
    // Note: SrsStats has { totalReviewed, streak, lastSessionDate, correctToday, totalToday }
    const stats = {
      totalReviewed: 100,
      streak: 10,
      lastSessionDate: '2023-01-01',
      correctToday: 40,
      totalToday: 50
    };
    saveStats(stats);
    const loaded = loadStats();
    expect(loaded.streak).toBe(10);
    expect(loaded.lastSessionDate).toBe('2023-01-01');
    expect(loaded.totalToday).toBe(50);
  });

  it('should compute SM-2 algorithm correctly for new cards', () => {
    const card = {
      id: 'test',
      interval: 0,
      repetitions: 0,
      easeFactor: 2.5,
      nextReview: 0,
      lastReview: 0,
    };
    // Rating 4 (Good) on a new card
    const next = sm2(card, 4);
    expect(next.interval).toBe(1);
    expect(next.repetitions).toBe(1);
    expect(next.easeFactor).toBe(2.5); // EF stays default
  });

  it('should compute SM-2 algorithm correctly for a failed card', () => {
    // Rating 0 (Again)
    const card = {
      id: 'test',
      interval: 10,
      repetitions: 3,
      easeFactor: 2.5,
      nextReview: 0,
      lastReview: 0,
    };
    const next = sm2(card, 0);
    expect(next.interval).toBe(1);
    expect(next.repetitions).toBe(0); // Reps reset
    expect(next.easeFactor).toBeLessThan(2.5); // EF should decrease
  });
});
