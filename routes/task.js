import express from 'express';
import { createTask, getAllUserTask } from '../controllers/task.js';

const router = express.Router();

router.post('/createTask', createTask)
router.post('/countTask', getAllUserTask)

export default router;
