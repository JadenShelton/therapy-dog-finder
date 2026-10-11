import { setStatusOverride } from '../src/data/devControls';
import { MockDataService } from '../src/data/mock';
import { mockUniversityData } from '../src/data/mock/data';
import type { Timer } from '../src/data/mock/simulator';
import type { LocationUpdate } from '../src/domain/types';

function fakeTimer() {
  const fns = new Map<number, () => void>();
  let id = 0;
  const timer: Timer = {
    setInterval: (fn) => {
      fns.set(++id, fn);
      return id;
    },
    clearInterval: (h) => void fns.delete(h as number),
  };
  return { timer, tick: () => fns.forEach((f) => f()), active: () => fns.size };
}

// Tue Oct 13 2026, 13:30 MDT: CSU is on duty (13-17, break 15:00).
let now = new Date('2026-10-13T19:30:00Z');
const setup = (dogId = 'dog-csu-biscuit') => {
  const t = fakeTimer();
  const svc = new MockDataService({ clock: () => now, timer: t.timer, latencyMs: 0 });
  const updates: LocationUpdate[] = [];
  const unsub = svc.subscribeToLocation(dogId, (u) => updates.push(u));
  return { t, svc, updates, unsub };
};

beforeEach(() => {
  now = new Date('2026-10-13T19:30:00Z');
  setStatusOverride('auto');
});

describe('movement simulator', () => {
  it('emits immediately on subscribe', () => {
    const { updates } = setup();
    expect(updates).toHaveLength(1);
    expect(updates[0].status).toBe('on_duty');
  });

  it('cycles through all stops, dwelling 1 or 2 ticks each', () => {
    const { t, updates } = setup();
    for (let i = 0; i < 20; i++) t.tick();
    const names = updates.map((u) => ('stopName' in u ? u.stopName : undefined));
    const stops = mockUniversityData.csu.stops.map((s) => s.name);
    expect(new Set(names)).toEqual(new Set(stops));
    // run lengths are 1 or 2 emissions of consecutive identical stop... plus initial emit
    const runs: number[] = [];
    names.forEach((n, i) => (i > 0 && n === names[i - 1] ? runs[runs.length - 1]++ : runs.push(1)));
    runs.slice(1, -1).forEach((r) => expect([1, 2]).toContain(r));
  });

  it('keeps the pin put during a break', () => {
    const { t, updates } = setup();
    now = new Date('2026-10-13T21:10:00Z'); // 15:10 MDT, break
    t.tick();
    const first = updates[updates.length - 1];
    expect(first.status).toBe('on_break');
    for (let i = 0; i < 6; i++) t.tick();
    const last = updates[updates.length - 1];
    expect(last.status).toBe('on_break');
    expect('coords' in last && 'coords' in first && last.coords).toEqual('coords' in first && first.coords);
  });

  it('has no coords when off duty and gives nextStart', () => {
    now = new Date('2026-10-13T03:00:00Z'); // Mon 21:00 MDT
    const { updates } = setup();
    const u = updates[0];
    expect(u.status).toBe('off_duty');
    expect('coords' in u).toBe(false);
    expect(u).toMatchObject({ nextStart: '2026-10-13T19:00:00.000Z' });
  });

  it('honors the dev override, including live changes', () => {
    const { updates } = setup();
    setStatusOverride('off_duty');
    expect(updates[updates.length - 1].status).toBe('off_duty');
    expect('coords' in updates[updates.length - 1]).toBe(false);
    setStatusOverride('on_break');
    expect(updates[updates.length - 1].status).toBe('on_break');
    setStatusOverride('on_duty');
    expect(updates[updates.length - 1].status).toBe('on_duty');
  });

  it('forces on_duty outside working hours', () => {
    now = new Date('2026-10-17T18:00:00Z'); // Saturday
    setStatusOverride('on_duty');
    const { updates } = setup();
    expect(updates[0].status).toBe('on_duty');
    expect('coords' in updates[0]).toBe(true);
  });

  it('stops the timer and emissions on unsubscribe', () => {
    const { t, updates, unsub } = setup();
    expect(t.active()).toBe(1);
    unsub();
    expect(t.active()).toBe(0);
    const n = updates.length;
    t.tick();
    setStatusOverride('off_duty');
    expect(updates).toHaveLength(n);
  });

  it('works for Utah with its own timezone data', () => {
    now = new Date('2026-10-13T16:00:00Z'); // Tue 10:00 MDT
    const { updates } = setup('dog-utah-juniper');
    expect(updates[0].status).toBe('on_duty');
  });
});

describe('MockDataService getters', () => {
  const svc = new MockDataService({ latencyMs: 0 });
  it('getDog returns null for an unknown id', async () => {
    await expect(svc.getDog('nope')).resolves.toBeNull();
  });
  it('getDog returns a dog per university', async () => {
    expect((await svc.getDog('csu'))?.name).toBe('Biscuit');
    expect((await svc.getDog('utah'))?.universityId).toBe('utah');
  });
  it('getSchedule rejects for unknown dog', async () => {
    await expect(svc.getSchedule('nope')).rejects.toThrow();
  });
  it('getUniversities lists the registry', async () => {
    expect((await svc.getUniversities()).map((u) => u.id)).toEqual(['csu', 'utah']);
  });
});
