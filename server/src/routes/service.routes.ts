import {Router} from 'express';import {db} from '../db/database.js';const r=Router();r.get('/',async(_,res)=>res.json((await db.query('SELECT * FROM services ORDER BY id')).rows));export default r;
