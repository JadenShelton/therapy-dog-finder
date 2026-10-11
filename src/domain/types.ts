export type LatLng = { latitude: number; longitude: number };

export type Handler = { firstName: string };

export type Dog = {
  id: string;
  name: string;
  universityId: string;
  handler: Handler;
  /** Placeholder image key. No real photos or logos in the prototype (D11). */
  photo?: string;
};

export type Stop = { id: string; name: string; coords: LatLng };

/** 0 = Sunday ... 6 = Saturday (same as Date#getDay). */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Local campus wall-clock time, 'HH:mm' (24 hour). */
export type TimeOfDay = string;

export type TimeRange = { start: TimeOfDay; end: TimeOfDay };

export type Shift = TimeRange & { breaks?: TimeRange[] };

export type RecurringStop = TimeRange & {
  weekday: Weekday;
  stopId: string;
  note?: string;
};

export type WeeklySchedule = {
  /** Shifts per weekday. Missing or empty means no shifts that day. */
  shifts: Partial<Record<Weekday, Shift[]>>;
  recurringStops: RecurringStop[];
  /** Stop catalog for the dog's campus; resolves RecurringStop.stopId to a name. */
  stops: Stop[];
};

export type DutyStatus = 'on_duty' | 'on_break' | 'off_duty';

export type LocationUpdate =
  | { status: 'on_duty' | 'on_break'; coords: LatLng; stopName?: string; updatedAt: string }
  | { status: 'off_duty'; nextStart: string | null; updatedAt: string };

export type UniversitySummary = {
  id: string;
  name: string;
  shortName: string;
  city: string;
  timezone: string;
};
