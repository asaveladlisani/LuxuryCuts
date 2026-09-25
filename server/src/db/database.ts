import pg from 'pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is not set. See server/.env.example.');

// Render's external URLs (*.render.com) require SSL; internal URLs and local Postgres do not.
export const db = new pg.Pool({
  connectionString,
  ssl: connectionString.includes('render.com') ? { rejectUnauthorized: false } : undefined,
});

export async function initDatabase() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS barbers(id INTEGER PRIMARY KEY,name TEXT NOT NULL,role TEXT NOT NULL,bio TEXT NOT NULL,image TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS services(id INTEGER PRIMARY KEY,name TEXT NOT NULL,description TEXT NOT NULL,price INTEGER NOT NULL,duration_minutes INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS bookings(id SERIAL PRIMARY KEY,customer_name TEXT NOT NULL,customer_email TEXT NOT NULL,customer_phone TEXT NOT NULL,service_id INTEGER NOT NULL REFERENCES services(id),barber_id INTEGER NOT NULL REFERENCES barbers(id),booking_date TEXT NOT NULL,booking_time TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'confirmed',created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
  `);

  const { rows } = await db.query<{ c: string }>('SELECT COUNT(*) c FROM services');
  if (Number(rows[0].c) > 0) return;

  const services = [[1,'Signature Cut','A tailored cut, hot towel finish and styling.',420,45],[2,'Skin Fade','Precision fade with clean lines and a refined finish.',480,55],[3,'Cut & Beard','Full haircut paired with beard sculpting and conditioning.',620,70],[4,'Beard Sculpt','Shape, line-up, hot towel and conditioning treatment.',260,30],[5,'Kids Cut','A relaxed, patient cut for guests under 12.',280,35],[6,'The Full Ritual','Signature cut, beard sculpt, hot towel and styling.',780,90]];
  const barbers = [[1,'Marcus Williams','Master Barber','Precision-led cuts with a classic Cape Town edge.','https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=900&q=85'],[2,'Daniel Mokoena','Senior Barber','Known for clean fades and effortless modern styling.','https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=900&q=85'],[3,'Leo Daniels','Barber & Stylist','Texture, shape and detail are his signature.','https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=900&q=85']];

  for (const s of services) await db.query('INSERT INTO services VALUES ($1,$2,$3,$4,$5) ON CONFLICT DO NOTHING', s);
  for (const b of barbers) await db.query('INSERT INTO barbers VALUES ($1,$2,$3,$4,$5) ON CONFLICT DO NOTHING', b);
}
