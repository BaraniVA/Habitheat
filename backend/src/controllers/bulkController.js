import Habit from '../models/habitModel.js';
import { sanitizeHabit } from '../utils/sanitizer.js';
import path from 'path';
import mongoose from 'mongoose';

// POST /api/habits/bulk/import
export const importHabits = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Using memory storage, so file is in req.file.buffer
    const fileBuffer = req.file.buffer;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();

    if (fileExtension === '.csv') {
      await handleCSVImport(fileBuffer, res);
    } else if (fileExtension === '.json') {
      await handleJSONImport(fileBuffer, res);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Unsupported file format'
      });
    }
  } catch (error) {
    console.error('Error in importHabits:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

export const handleCSVImport = async (fileBuffer, res) => {
  const importedHabits = [];
  const errors = [];
  let rowIndex = 0;

  // Convert buffer to string and split into lines
  const csvContent = fileBuffer.toString('utf8');
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue; // Skip empty lines
    
    rowIndex++;
    try {
      const values = lines[i].split(',').map(v => v.trim());
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });

      const habit = validateImportedHabit(row, rowIndex);
      if (habit.errors.length > 0) {
        errors.push(...habit.errors);
        continue;
      }
      importedHabits.push(habit.data);
    } catch (error) {
      errors.push(`Row ${rowIndex}: ${error.message}`);
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Import failed with validation errors',
      errors
    });
  }

  try {
    const createdHabits = await Habit.insertMany(importedHabits, {
      ordered: false,
      validateBeforeSave: true
    });

    res.status(200).json({
      success: true,
      message: `Successfully imported ${createdHabits.length} habits`,
      data: {
        imported: createdHabits.length,
        habits: createdHabits
      }
    });
  } catch (dbError) {
    console.error('Database error during bulk import:', dbError);
    res.status(500).json({
      success: false,
      message: 'Database error during import',
      error: dbError.message
    });
  }
};

export const handleJSONImport = async (fileBuffer, res) => {
  try {
    const jsonContent = fileBuffer.toString('utf8');
    const data = JSON.parse(jsonContent);

    if (!Array.isArray(data)) {
      return res.status(400).json({
        success: false,
        message: 'JSON file must contain an array of habits'
      });
    }

    const importedHabits = [];
    const errors = [];

    data.forEach((habitData, index) => {
      try {
        const habit = validateImportedHabit(habitData, index + 1);
        if (habit.errors.length > 0) {
          errors.push(...habit.errors);
          return;
        }
        importedHabits.push(habit.data);
      } catch (error) {
        errors.push(`Item ${index + 1}: ${error.message}`);
      }
    });

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Import failed with validation errors',
        errors
      });
    }

    const createdHabits = await Habit.insertMany(importedHabits, {
      ordered: false,
      validateBeforeSave: true
    });

    res.status(200).json({
      success: true,
      message: `Successfully imported ${createdHabits.length} habits`,
      data: {
        imported: createdHabits.length,
        habits: createdHabits
      }
    });
  } catch (error) {
    console.error('Error in handleJSONImport:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to parse JSON file',
      error: error.message
    });
  }
};

export const validateImportedHabit = (habitData, index) => {
  const errors = [];

  const habit = {
    name: typeof habitData.name === 'string' ? habitData.name.trim() : habitData.name,
    description: typeof habitData.description === 'string' ? habitData.description.trim() : habitData.description,
    category: typeof habitData.category === 'string' ? habitData.category.trim() : habitData.category,
    frequency: typeof habitData.frequency === 'string' ? habitData.frequency.trim() : habitData.frequency,
    targetValue: habitData.targetValue ? parseInt(habitData.targetValue) : undefined,
    unit: typeof habitData.unit === 'string' ? habitData.unit.trim() : habitData.unit,
    isActive: habitData.isActive === 'true' || habitData.isActive === true,
    reminderTime: typeof habitData.reminderTime === 'string' ? habitData.reminderTime.trim() : habitData.reminderTime,
    tags: habitData.tags ?
      (typeof habitData.tags === 'string' ? habitData.tags.split(',').map(tag => tag.trim()) : habitData.tags) : []
  };

  if (!habit.name || habit.name.length === 0) {
    errors.push(`Row/Item ${index}: Name is required`);
  }

  if (!['health', 'productivity', 'learning', 'fitness', 'mindfulness', 'social', 'other'].includes(habit.category)) {
    errors.push(`Row/Item ${index}: Invalid category`);
  }

  if (!['daily', 'weekly', 'monthly'].includes(habit.frequency)) {
    errors.push(`Row/Item ${index}: Invalid frequency`);
  }

  return {
    data: sanitizeHabit(habit),
    errors
  };
};

// GET /api/habits/bulk/export
export const exportHabits = async (req, res) => {
  try {
    const format = req.query.format || 'json';
    const userId = req.query.userId;
    const query = userId ? { userId: new mongoose.Types.ObjectId(userId) } : {};
    const habits = await Habit.find(query).sort({ createdAt: -1 });

    if (format === 'csv') {
      // Generate CSV content in memory
      const headers = ['ID', 'Name', 'Description', 'Category', 'Frequency', 'Target Value', 'Unit', 'Active', 'Reminder Time', 'Tags', 'Streak', 'Created At', 'Updated At'];
      
      const csvRows = [
        headers.join(','),
        ...habits.map(habit => {
          const row = [
            habit._id,
            `"${habit.name?.replace(/"/g, '""') || ''}"`,
            `"${habit.description?.replace(/"/g, '""') || ''}"`,
            habit.category || '',
            habit.frequency || '',
            habit.targetValue || '',
            `"${habit.unit?.replace(/"/g, '""') || ''}"`,
            habit.isActive,
            habit.reminderTime || '',
            `"${habit.tags?.join(', ')?.replace(/"/g, '""') || ''}"`,
            habit.streak || 0,
            habit.createdAt,
            habit.updatedAt
          ];
          return row.join(',');
        })
      ];

      const csvContent = csvRows.join('\n');
      
      res.setHeader('Content-Disposition', 'attachment; filename=habits.csv');
      res.setHeader('Content-Type', 'text/csv');
      res.status(200).send(csvContent);
    } else {
      res.setHeader('Content-Disposition', 'attachment; filename=habits.json');
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        success: true,
        exportedAt: new Date().toISOString(),
        totalHabits: habits.length,
        data: habits
      });
    }
  } catch (error) {
    console.error('Error in exportHabits:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// DELETE /api/habits/bulk/delete
export const bulkDeleteHabits = async (req, res) => {
  try {
    const idsToDelete = req.body.ids;
    const invalidIds = idsToDelete.filter(id => !mongoose.Types.ObjectId.isValid(id));

    if (invalidIds.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid habit ID format',
        invalidIds
      });
    }

    const objectIds = idsToDelete.map(id => new mongoose.Types.ObjectId(id));
    const existingHabits = await Habit.find({ _id: { $in: objectIds } });
    const existingIds = existingHabits.map(habit => habit._id.toString());
    const notFoundIds = idsToDelete.filter(id => !existingIds.includes(id));

    const deleteResult = await Habit.deleteMany({ _id: { $in: objectIds } });

    res.status(200).json({
      success: true,
      message: `Successfully deleted ${deleteResult.deletedCount} habits`,
      data: {
        deleted: existingHabits,
        notFound: notFoundIds,
        deletedCount: deleteResult.deletedCount
      }
    });
  } catch (error) {
    console.error('Error in bulkDeleteHabits:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
