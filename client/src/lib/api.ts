const API=import.meta.env.VITE_API_URL||'http://localhost:4000/api';
export async function getServices(){const r=await fetch(`${API}/services`);return r.json()}
export async function getBarbers(){const r=await fetch(`${API}/barbers`);return r.json()}
export async function getAvailability(date:string,serviceId:number,barberId:number){const q=new URLSearchParams({date,serviceId:String(serviceId),barberId:String(barberId)});const r=await fetch(`${API}/bookings/availability?${q}`);return r.json()}
export async function createBooking(payload:Record<string,unknown>){const r=await fetch(`${API}/bookings`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});if(!r.ok)throw new Error((await r.json()).message||'Booking failed');return r.json()}
