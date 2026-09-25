const API=import.meta.env.VITE_API_URL||'http://localhost:4000/api';
async function request(path:string,init?:RequestInit){const r=await fetch(`${API}${path}`,init);const body=await r.json().catch(()=>({}));if(!r.ok)throw new Error(body.message||'Something went wrong. Please try again.');return body}
export function getServices(){return request('/services')}
export function getBarbers(){return request('/barbers')}
export function getAvailability(date:string,serviceId:number,barberId:number){const q=new URLSearchParams({date,serviceId:String(serviceId),barberId:String(barberId)});return request(`/bookings/availability?${q}`)}
export function createBooking(payload:Record<string,unknown>){return request('/bookings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})}
