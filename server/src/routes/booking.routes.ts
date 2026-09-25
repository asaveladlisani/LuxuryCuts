import { Router } from 'express';
import { db } from '../db/database.js';

const r = Router();

// Opening hours per weekday (0 = Sunday), in minutes from midnight. null = closed.
const HOURS: Record<number, [number, number] | null> = {
  0: null,
  1: null,
  2: [9 * 60, 19 * 60],
  3: [9 * 60, 19 * 60],
  4: [9 * 60, 19 * 60],
  5: [9 * 60, 19 * 60],
  6: [8 * 60, 16 * 60],
};
const SLOT_STEP = 30;
const TIME_ZONE = 'Africa/Johannesburg';

const toMinutes = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};
const toTime = (mins: number) =>
  `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;

// Current date (YYYY-MM-DD) and minutes-from-midnight in the shop's time zone
function shopNow() {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: TIME_ZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(new Date())
      .map((p) => [p.type, p.value])
  );
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
}

function isValidDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const [y, m, d] = date.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

// Start times that fit the service inside opening hours, are in the future and
// don't overlap an existing booking with the same barber.
function availableSlots(date: string, serviceId: number, barberId: number) {
  const service = db
    .prepare('SELECT duration_minutes FROM services WHERE id = ?')
    .get(serviceId) as { duration_minutes: number } | undefined;
  if (!service || !isValidDate(date)) return [];

  const [y, m, d] = date.split('-').map(Number);
  const hours = HOURS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  if (!hours) return [];

  const now = shopNow();
  if (date < now.date) return [];

  const booked = (
    db
      .prepare(
        `SELECT b.booking_time, s.duration_minutes
         FROM bookings b
         JOIN services s ON s.id = b.service_id
         WHERE b.booking_date = ?
           AND b.barber_id = ?
           AND b.status = 'confirmed'`
      )
      .all(date, barberId) as { booking_time: string; duration_minutes: number }[]
  ).map((b) => [toMinutes(b.booking_time), toMinutes(b.booking_time) + b.duration_minutes]);

  const [open, close] = hours;
  const slots: string[] = [];
  for (let start = open; start + service.duration_minutes <= close; start += SLOT_STEP) {
    const end = start + service.duration_minutes;
    if (date === now.date && start <= now.minutes) continue;
    if (booked.some(([bs, be]) => start < be && end > bs)) continue;
    slots.push(toTime(start));
  }
  return slots;
}

// Get available booking times
r.get('/availability', (req, res) => {
  const { date, serviceId, barberId } = req.query;

  if (!date || !serviceId || !barberId) {
    return res.status(400).json({
      message: 'date, serviceId and barberId are required',
    });
  }

  res.json(availableSlots(String(date), Number(serviceId), Number(barberId)));
});

// Create booking
r.post('/', (req, res) => {
  const {
    customerName,
    customerEmail,
    customerPhone,
    serviceId,
    barberId,
    date,
    time,
  } = req.body;

  if (
    !customerName?.trim() ||
    !customerEmail?.trim() ||
    !customerPhone?.trim() ||
    !serviceId ||
    !barberId ||
    !date ||
    !time
  ) {
    return res.status(400).json({
      message: 'Please complete all booking fields.',
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
  }

  if (String(customerPhone).replace(/\D/g, '').length < 9) {
    return res.status(400).json({ message: 'Please enter a valid phone number.' });
  }

  // Re-check the slot on the server so closed days, past times and overlaps can't be booked
  if (!availableSlots(String(date), Number(serviceId), Number(barberId)).includes(time)) {
    return res.status(409).json({
      message: 'That time is no longer available. Please choose another slot.',
    });
  }

  const info = db
    .prepare(
      `INSERT INTO bookings (
        customer_name,
        customer_email,
        customer_phone,
        service_id,
        barber_id,
        booking_date,
        booking_time
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      customerName.trim(),
      customerEmail.trim(),
      customerPhone.trim(),
      serviceId,
      barberId,
      date,
      time
    );

  // Return complete booking information
  const booking = db
    .prepare(
      `SELECT
        b.*,
        s.name AS service,
        s.duration_minutes AS duration,
        s.price AS price,
        br.name AS barber
       FROM bookings b
       JOIN services s ON s.id = b.service_id
       JOIN barbers br ON br.id = b.barber_id
       WHERE b.id = ?`
    )
    .get(info.lastInsertRowid);

  res.status(201).json(booking);
});

export default r;
