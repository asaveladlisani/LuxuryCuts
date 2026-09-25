import {Router} from 'express';import {db} from '../db/database.js';const r=Router();r.get('/',(_,res)=>res.json(db.prepare('SELECT * FROM barbers ORDER BY id').all()));export default r;
