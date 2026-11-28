import { HttpError } from './http';

/** What a friend sees of one class: times and rooms, never seats, CRN-level registration data or instructors' emails. */
export type SharedMeeting = {
  days: string[];
  start: string | null;
  end: string | null;
  building: string | null;
  room: string | null;
  type: string;
  startDate: string | null;
  endDate: string | null;
};

export type SharedSection = {
  crn: string;
  subject: string;
  number: string;
  section: string;
  title: string;
  type: string;
  instructor: string | null;
  meetings: SharedMeeting[];
};

const MAX_SECTIONS = 20;
const DAYS = new Set(['M', 'T', 'W', 'R', 'F', 'S', 'U']);
const CLOCK = /^\d{2}:\d{2}$/;
const DATE = /^[\d/-]{8,10}$/;

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.slice(0, max) : '');
const opt = (v: unknown, max: number) => (typeof v === 'string' && v ? v.slice(0, max) : null);

/** Keeps only the known fields, so the server never stores anything the app didn't mean to share. */
export function cleanSections(value: unknown): SharedSection[] {
  if (!Array.isArray(value) || value.length > MAX_SECTIONS) throw new HttpError(400, 'Invalid schedule');
  return value.map((raw): SharedSection => {
    const s = (raw ?? {}) as Record<string, unknown>;
    const crn = str(s.crn, 10);
    if (!/^\d{1,10}$/.test(crn)) throw new HttpError(400, 'Invalid schedule');
    const meetings = Array.isArray(s.meetings) ? s.meetings.slice(0, 6) : [];
    return {
      crn,
      subject: str(s.subject, 8),
      number: str(s.number, 8),
      section: str(s.section, 6),
      title: str(s.title, 120),
      type: str(s.type, 40),
      instructor: opt(s.instructor, 80),
      meetings: meetings.map((m): SharedMeeting => {
        const x = (m ?? {}) as Record<string, unknown>;
        const clock = (v: unknown) => (typeof v === 'string' && CLOCK.test(v) ? v : null);
        const date = (v: unknown) => (typeof v === 'string' && DATE.test(v) ? v : null);
        return {
          days: Array.isArray(x.days) ? x.days.filter((d): d is string => typeof d === 'string' && DAYS.has(d)) : [],
          start: clock(x.start),
          end: clock(x.end),
          building: opt(x.building, 60),
          room: opt(x.room, 20),
          type: str(x.type, 40),
          startDate: date(x.startDate),
          endDate: date(x.endDate),
        };
      }),
    };
  });
}

/** Banner term codes, like 202610. */
export function cleanTerm(value: string): string {
  if (!/^\d{6}$/.test(value)) throw new HttpError(400, 'Invalid term');
  return value;
}
