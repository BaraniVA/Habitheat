import express from 'express';
const habitRoutes = express.Router();
import  { getAllHabits, getStats, getHabitById, createHabit, updateHabit, deleteHabit}  from '../controllers/habitController.js';
import {
  validateHabit,
  validateHabitUpdate,
  validatePagination,
  validateId,
  handleValidationErrors
} from '../middleware/validation.js';

// GET /api/habits/stats - Must come before /:id route
habitRoutes.get('/stats', getStats);

// GET /api/habits
habitRoutes.get('/', validatePagination, handleValidationErrors, getAllHabits);

// GET /api/habits/:id
habitRoutes.get('/:id', validateId, handleValidationErrors, getHabitById);

// POST /api/habits
habitRoutes.post('/', validateHabit, handleValidationErrors, createHabit);

// PUT /api/habits/:id
habitRoutes.put('/:id', validateId, validateHabitUpdate, handleValidationErrors, updateHabit);

// DELETE /api/habits/:id
habitRoutes.delete('/:id', validateId, handleValidationErrors, deleteHabit);

export default habitRoutes;
