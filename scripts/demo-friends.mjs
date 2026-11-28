// Adds (or removes) demo friends for one account, to preview the Friends UI with real data.
// Usage: node --env-file=.env.local scripts/demo-friends.mjs <user-id> [--remove]
// Demo users have apple_sub 'demo-friend-*', so --remove deletes exactly them (and their friendships cascade).
import pg from 'pg';

const [userId, flag] = process.argv.slice(2);
if (!userId) throw new Error('Pass the user id to befriend.');
const db = new pg.Client({ connectionString: process.env.DATABASE_URL_UNPOOLED });
await db.connect();

const FALL = ['09/24/2026', '12/04/2026'];
const WINTER = ['01/04/2027', '03/12/2027'];
const section = (crn, subject, number, type, days, start, end, building, room, [startDate, endDate], title = `${subject} ${number}`) => ({
  crn, subject, number, section: '001', title, type, instructor: null,
  meetings: [{ days: days.split(''), start, end, building, room, type: 'Class', startDate, endDate }],
});

const DEMO = [
  {
    key: 'maya', name: 'Maya Chen', paused: false,
    fall: [
      section('33530', 'MATH', '009C', 'Lecture', 'MWF', '10:00', '10:50', 'Bourns Hall', 'A125', FALL),
      section('30948', 'CS', '010B', 'Lecture', 'MWF', '13:00', '13:50', 'UG Teaching Learning Facility', '0415', FALL),
      section('22101', 'PHYS', '040B', 'Lecture', 'TR', '11:00', '12:20', 'Physics', '2000', FALL),
    ],
    winter: [
      section('41644', 'CS', '011', 'Lecture', 'MWF', '14:00', '14:50', 'UG Teaching Learning Facility', '0107', WINTER),
      section('36782', 'MATH', '031', 'Lecture', 'MW', '08:00', '09:20', 'Student Success Center', '235', WINTER),
    ],
  },
  {
    key: 'leo', name: 'Leo Ramirez', paused: false,
    fall: [
      section('30948', 'CS', '010B', 'Lecture', 'MWF', '13:00', '13:50', 'UG Teaching Learning Facility', '0415', FALL),
      section('32710', 'CS', '010B', 'Laboratory', 'T', '14:00', '15:50', 'UG Teaching Learning Facility', '0206', FALL),
      section('25500', 'ECON', '002', 'Lecture', 'TR', '09:30', '10:50', 'Pierce Hall', '1000', FALL),
    ],
    winter: [section('49659', 'CS', '010C', 'Lecture', 'TR', '15:30', '16:50', 'UG Teaching Learning Facility', '0415', WINTER)],
  },
  {
    key: 'sam', name: 'Sam Okafor', paused: false,
    fall: [
      section('42166', 'WRIT', '010S', 'Lecture', 'MW', '15:30', '16:50', 'Sproul Hall', '1102', FALL),
      section('27711', 'BIOL', '005A', 'Lecture', 'MWF', '09:00', '09:50', 'Genomics', '1102', FALL),
    ],
    winter: [],
  },
  {
    key: 'jordan', name: 'Jordan Kim', paused: false,
    fall: [
      section('21900', 'ENGL', '001B', 'Lecture', 'TR', '12:30', '13:50', 'HMNSS', '1500', FALL),
      section('21950', 'MUS', '010', 'Lecture', 'MW', '11:00', '12:20', 'Arts', '157', FALL),
    ],
    winter: [section('35288', 'ETST', '002', 'Lecture', 'TR', '09:30', '10:50', 'CHASS Interdisciplinary-North', '1020', WINTER)],
  },
  { key: 'priya', name: 'Priya Patel', paused: true, fall: [section('33530', 'MATH', '009C', 'Lecture', 'MWF', '10:00', '10:50', 'Bourns Hall', 'A125', FALL)], winter: [] },
];

try {
  await db.query(`delete from users where apple_sub like 'demo-friend-%'`);
  if (flag === '--remove') {
    console.log('Removed demo friends.');
  } else {
    for (const d of DEMO) {
      const { rows } = await db.query('insert into users (apple_sub, name, sharing_paused) values ($1, $2, $3) returning id', [`demo-friend-${d.key}`, d.name, d.paused]);
      const id = rows[0].id;
      for (const [term, sections] of [['202640', d.fall], ['202710', d.winter]]) {
        if (sections.length) await db.query('insert into schedules (user_id, term, sections, hash) values ($1, $2, $3, $4)', [id, term, JSON.stringify(sections), 'demo']);
      }
      const [a, b] = [id, userId].sort();
      await db.query('insert into friendships (a, b) values ($1, $2)', [a, b]);
    }
    console.log(`Added ${DEMO.length} demo friends.`);
  }
} finally {
  await db.end();
}
