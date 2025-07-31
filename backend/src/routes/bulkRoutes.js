import express from 'express';
const bulkRoutes = express.Router();
import { importHabits, exportHabits, bulkDeleteHabits} from '../controllers/bulkController.js';
import { strictRateLimit } from '../middleware/ratelimiting.js';
import { upload } from '../utils/fileHandler.js';
import {
  validateBulkDelete,
  validateExport,
  handleValidationErrors
} from '../middleware/validation.js';

// POST /api/habits/bulk/import
bulkRoutes.post('/import', 
  strictRateLimit,
  upload.single('file'),
  importHabits
);

// GET /api/habits/bulk/export
bulkRoutes.get('/export',
  strictRateLimit,
  validateExport,
  handleValidationErrors,
  exportHabits
);

// DELETE /api/habits/bulk/delete
bulkRoutes.delete('/delete',
  strictRateLimit,
  validateBulkDelete,
  handleValidationErrors,
  bulkDeleteHabits
);

export default bulkRoutes;