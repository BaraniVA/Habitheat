import Habit from '../models/habitModel.js';
import { sanitizeHabit } from '../utils/sanitizer.js';
import mongoose from 'mongoose';


export const getAllHabits = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const category = req.query.category;
      const isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;
      const search = req.query.search;

      const filters = { category, isActive, search };
      
      // Calculate skip value for pagination
      const skip = (page - 1) * limit;
      
      // Build query options
      const options = {
        skip,
        limit,
        sort: { createdAt: -1 } // Sort by newest first
      };

      // Get filtered habits
      const habits = await Habit.findWithFilters(filters, options);
      
      // Get total count for pagination
      const totalHabits = await Habit.countDocuments(
        filters.category || filters.isActive !== undefined || filters.search 
          ? await this.buildFilterQuery(filters)
          : {}
      );

      // Calculate pagination info
      const totalPages = Math.ceil(totalHabits / limit);
      const hasNext = page < totalPages;
      const hasPrev = page > 1;

      res.status(200).json({
        success: true,
        data: habits,
        pagination: {
          currentPage: page,
          totalPages,
          totalHabits,
          hasNext,
          hasPrev,
          limit
        }
      });
    } catch (error) {
      console.error('Error in getAllHabits:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
}

  // Helper method to build filter query
export const buildFilterQuery = async (filters) => {
    const query = {};
    
    if (filters.category) query.category = filters.category;
    if (filters.isActive !== undefined) query.isActive = filters.isActive;
    if (filters.search) {
      query.$text = { $search: filters.search };
    }
    
    return query;
  }

  // GET /api/habits/:id
export const getHabitById =  async (req, res) => {
    try {
      const habitId = req.params.id;

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(habitId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid habit ID format'
        });
      }

      const habit = await Habit.findById(habitId);

      if (!habit) {
        return res.status(404).json({
          success: false,
          message: 'Habit not found'
        });
      }

      res.status(200).json({
        success: true,
        data: habit
      });
    } catch (error) {
      console.error('Error in getHabitById:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
}

  // POST /api/habits
export const createHabit =  async (req, res) => {
    try {
      const habitData = sanitizeHabit(req.body);
      
      const newHabit = new Habit(habitData);
      await newHabit.save();

      res.status(201).json({
        success: true,
        message: 'Habit created successfully',
        data: newHabit
      });
    } catch (error) {
      console.error('Error in createHabit:', error);
      
      // Handle validation errors
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }));
        
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationErrors
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
}

  // PUT /api/habits/:id
export const updateHabit =  async (req, res) => {
    try {
      const habitId = req.params.id;
      const updateData = sanitizeHabit(req.body);

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(habitId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid habit ID format'
        });
      }

      const updatedHabit = await Habit.findByIdAndUpdate(
        habitId,
        updateData,
        { 
          new: true, // Return updated document
          runValidators: true // Run schema validation
        }
      );

      if (!updatedHabit) {
        return res.status(404).json({
          success: false,
          message: 'Habit not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Habit updated successfully',
        data: updatedHabit
      });
    } catch (error) {
      console.error('Error in updateHabit:', error);
      
      // Handle validation errors
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }));
        
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationErrors
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
}

  // DELETE /api/habits/:id
export const deleteHabit = async (req, res) => {
    try {
      const habitId = req.params.id;

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(habitId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid habit ID format'
        });
      }

      const deletedHabit = await Habit.findByIdAndDelete(habitId);

      if (!deletedHabit) {
        return res.status(404).json({
          success: false,
          message: 'Habit not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Habit deleted successfully',
        data: deletedHabit
      });
    } catch (error) {
      console.error('Error in deleteHabit:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
}

  // GET /api/habits/stats
export const getStats = async (req, res) => {
    try {
      const userId = req.query.userId; // Optional user filter
      const stats = await Habit.getStatsByUserId(userId);
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error in getStats:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
}

  // POST /api/habits/:id/complete
export const  markHabitComplete = async (req, res) => {
    try {
      const habitId = req.params.id;
      const completionDate = req.body.date ? new Date(req.body.date) : new Date();

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(habitId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid habit ID format'
        });
      }

      const habit = await Habit.findById(habitId);
      
      if (!habit) {
        return res.status(404).json({
          success: false,
          message: 'Habit not found'
        });
      }

      await habit.markCompleted(completionDate);

      res.status(200).json({
        success: true,
        message: 'Habit marked as completed',
        data: habit
      });
    } catch (error) {
      console.error('Error in markHabitComplete:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
}
