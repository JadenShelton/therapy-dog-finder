import { computeStatus } from '../src/domain/status';
import type { WeeklySchedule } from '../src/domain/types';

const TZ = 'America/Denver';
const schedule: WeeklySchedule = {
  shifts: {
    1: [{ start: '10:00', end: '14:00', breaks: [{ start: '12:00', end: '12:30' }] }],
    5: [{ start: '10:00', end: '14:00', breaks: [{ start: '12:00', end: '12:30' }] }],
  },
  recurringStops: [],
};
// October 2026 is MDT (UTC-6). Mon Oct 12 2026.
const mdt = (day: number, hhmm: string) => new Date(`2026-10-${String(day).padStart(2, '0')}T${hhmm}:00-06:00`);

describe('computeStatus', () => {
  it('before the shift: off duty, next start later today', () => {
    const r = computeStatus(schedule, mdt(12, '08:00'), TZ);
    expect(r.status).toBe('off_duty');
    expect(r.nextStart).toBe('2026-10-12T16:00:00.000Z');
    expect(r.todayHours).toEqual([{ start: '10:00', end: '14:00' }]);
  });
  it('during the shift', () => {
    expect(computeStatus(schedule, mdt(12, '10:00'), TZ).status).toBe('on_duty');
    expect(computeStatus(schedule, mdt(12, '11:59'), TZ).status).toBe('on_duty');
  });
  it('during the break (start inclusive, end exclusive)', () => {
    expect(computeStatus(schedule, mdt(12, '12:00'), TZ).status).toBe('on_break');
    expect(computeStatus(schedule, mdt(12, '12:29'), TZ).status).toBe('on_break');
    expect(computeStatus(schedule, mdt(12, '12:30'), TZ).status).toBe('on_duty');
  });
  it('after the shift: next start is a later day', () => {
    const r = computeStatus(schedule, mdt(12, '14:00'), TZ);
    expect(r.status).toBe('off_duty');
    expect(r.nextStart).toBe('2026-10-16T16:00:00.000Z'); // Fri Oct 16 10:00 MDT
  });
  it('weekend: off duty, empty hours, next start Monday', () => {
    const r = computeStatus({ ...schedule, shifts: { 1: schedule.shifts[1] } }, mdt(10, '11:00'), TZ); // Sat
    expect(r.status).toBe('off_duty');
    expect(r.todayHours).toEqual([]);
    expect(r.nextStart).toBe('2026-10-12T16:00:00.000Z');
  });
  it('wraps across the week', () => {
    const r = computeStatus(schedule, mdt(16, '15:00'), TZ); // Fri after shift
    expect(r.nextStart).toBe('2026-10-19T16:00:00.000Z');
  });
  it('same weekday next week when only one shift day exists and it already ended', () => {
    const only: WeeklySchedule = { shifts: { 1: [{ start: '10:00', end: '14:00' }] }, recurringStops: [] };
    expect(computeStatus(only, mdt(12, '15:00'), TZ).nextStart).toBe('2026-10-19T16:00:00.000Z');
  });
  it('empty schedule gives null', () => {
    const r = computeStatus({ shifts: {}, recurringStops: [] }, mdt(12, '11:00'), TZ);
    expect(r).toEqual({ status: 'off_duty', nextStart: null, todayHours: [] });
  });
  it('evaluates in the campus zone, not UTC', () => {
    // 03:00Z Tuesday is still Monday 21:00 MDT.
    const r = computeStatus(schedule, new Date('2026-10-13T03:00:00Z'), TZ);
    expect(r.todayHours).toEqual([{ start: '10:00', end: '14:00' }]);
  });

  describe('DST end, Sunday Nov 1 2026 (02:00 MDT -> 01:00 MST)', () => {
    const sun: WeeklySchedule = {
      shifts: { 0: [{ start: '09:00', end: '12:00' }], 6: [{ start: '09:00', end: '12:00' }] },
      recurringStops: [],
    };
    it('next start across the change uses the new offset', () => {
      const r = computeStatus(sun, new Date('2026-10-31T20:00:00Z'), TZ); // Sat 14:00 MDT
      expect(r.nextStart).toBe('2026-11-01T16:00:00.000Z'); // 09:00 MST = UTC-7
    });
    it('on duty at 10:00 MST on Nov 1', () => {
      expect(computeStatus(sun, new Date('2026-11-01T17:00:00Z'), TZ).status).toBe('on_duty');
      expect(computeStatus(sun, new Date('2026-11-01T15:59:00Z'), TZ).status).toBe('off_duty');
    });
    it('week after the change keeps wall-clock times', () => {
      const r = computeStatus(sun, new Date('2026-11-01T20:00:00Z'), TZ); // Sun 13:00 MST
      expect(r.nextStart).toBe('2026-11-07T16:00:00.000Z'); // Sat Nov 7 09:00 MST
    });
  });
});
