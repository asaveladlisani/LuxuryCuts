import { Router } from 'express';
import { db } from '../db/database.js';

const r = Router();

const times = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
];

// Get available booking times
r.get('/availability', async (req, res) => {
  const { date, serviceId, barberId } = req.query;

  if (!date || !serviceId || !barberId) {
    return res.status(400).json({
      message: 'date, serviceId and barberId are required',
    });
  }

  const { rows } = await db.query<{ booking_time: string }>(
    `SELECT booking_time
     FROM bookings
     WHERE booking_date = $1
       AND barber_id = $2
       AND status = 'confirmed'`,
    [date, barberId]
  );

  const taken = new Set(rows.map((x) => x.booking_time));

  res.json(times.filter((time) => !taken.has(time)));
});

// Create booking
r.post('/', async (req, res) => {
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
    !customerName ||
    !customerEmail ||
    !customerPhone ||
    !serviceId ||
    !barberId ||
    !date ||
    !time
  ) {
    return res.status(400).json({
      message: 'Please complete all booking fields.',
    });
  }

  // Check if the selected slot is already booked
  const exists = await db.query(
    `SELECT id
     FROM bookings
     WHERE booking_date = $1
       AND booking_time = $2
       AND barber_id = $3
       AND status = 'confirmed'`,
    [date, time, barberId]
  );

  if (exists.rowCount) {
    return res.status(409).json({
      message: 'That time is no longer available. Please choose another slot.',
    });
  }

  // Create booking
  const info = await db.query<{ id: number }>(
    `INSERT INTO bookings (
      customer_name,
      customer_email,
      customer_phone,
      service_id,
      barber_id,
      booking_date,
      booking_time
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id`,
    [customerName, customerEmail, customerPhone, serviceId, barberId, date, time]
  );

  // Return complete booking information
  const { rows: [booking] } = await db.query(
    `SELECT
      b.*,
      s.name AS service,
      s.duration_minutes AS duration,
      br.name AS barber
     FROM bookings b
     JOIN services s ON s.id = b.service_id
     JOIN barbers br ON br.id = b.barber_id
     WHERE b.id = $1`,
    [info.rows[0].id]
  );

  res.status(201).json(booking);
});

export default r;