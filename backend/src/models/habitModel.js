import mongoose from 'mongoose';

// Habit Schema
const habitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Habit name is required'],
    trim: true,
    minlength: [1, 'Name must be at least 1 character'],
    maxlength: [100, 'Name must be less than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description must be less than 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['health', 'productivity', 'learning', 'fitness', 'mindfulness', 'social', 'other'],
      message: 'Category must be one of: health, productivity, learning, fitness, mindfulness, social, other'
    }
  },
  frequency: {
    type: String,
    required: [true, 'Frequency is required'],
    enum: {
      values: ['daily', 'weekly', 'monthly'],
      message: 'Frequency must be one of: daily, weekly, monthly'
    }
  },
  targetValue: {
    type: Number,
    min: [1, 'Target value must be at least 1'],
    max: [1000, 'Target value must be less than 1000']
  },
  unit: {
    type: String,
    trim: true,
    maxlength: [20, 'Unit must be less than 20 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  reminderTime: {
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true; // Optional field
        return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'Reminder time must be in HH:MM format'
    }
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Each tag must be less than 30 characters']
  }],
  streak: {
    type: Number,
    default: 0,
    min: [0, 'Streak cannot be negative']
  },
  completedDates: [{
    type: Date
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // Remove required for now since we don't have user authentication
    // required: [true, 'User ID is required']
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
habitSchema.index({ userId: 1, category: 1 });
habitSchema.index({ userId: 1, isActive: 1 });
habitSchema.index({ userId: 1, createdAt: -1 });
habitSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Virtual for habit completion rate
habitSchema.virtual('completionRate').get(function() {
  if (this.completedDates.length === 0) return 0;
  
  const daysSinceCreation = Math.ceil((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
  let expectedCompletions = 0;
  
  switch (this.frequency) {
    case 'daily':
      expectedCompletions = daysSinceCreation;
      break;
    case 'weekly':
      expectedCompletions = Math.ceil(daysSinceCreation / 7);
      break;
    case 'monthly':
      expectedCompletions = Math.ceil(daysSinceCreation / 30);
      break;
  }
  
  return expectedCompletions > 0 ? (this.completedDates.length / expectedCompletions) * 100 : 0;
});

// Static methods for complex queries
habitSchema.statics.findWithFilters = function(filters = {}, options = {}) {
  const query = {};
  
  // Apply filters
  if (filters.category) query.category = filters.category;
  if (filters.isActive !== undefined) query.isActive = filters.isActive;
  if (filters.userId) query.userId = filters.userId;
  
  // Text search
  if (filters.search) {
    query.$text = { $search: filters.search };
  }
  
  return this.find(query, null, options);
};

habitSchema.statics.getStatsByUserId = async function(userId = null) {
  const matchStage = userId ? { userId: new mongoose.Types.ObjectId(userId) } : {};
  
  const stats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalHabits: { $sum: 1 },
        activeHabits: {
          $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
        },
        averageStreak: { $avg: '$streak' },
        categories: { $push: '$category' },
        frequencies: { $push: '$frequency' }
      }
    }
  ]);
  
  if (stats.length === 0) {
    return {
      totalHabits: 0,
      activeHabits: 0,
      inactiveHabits: 0,
      categoryCounts: {},
      frequencyCounts: {},
      averageStreak: 0
    };
  }
  
  const result = stats[0];
  
  // Count categories
  const categoryCounts = result.categories.reduce((acc, category) => {
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});
  
  // Count frequencies
  const frequencyCounts = result.frequencies.reduce((acc, frequency) => {
    acc[frequency] = (acc[frequency] || 0) + 1;
    return acc;
  }, {});
  
  return {
    totalHabits: result.totalHabits,
    activeHabits: result.activeHabits,
    inactiveHabits: result.totalHabits - result.activeHabits,
    categoryCounts,
    frequencyCounts,
    averageStreak: Math.round(result.averageStreak * 100) / 100 || 0
  };
};

// Instance methods
habitSchema.methods.markCompleted = function(date = new Date()) {
  if (!this.completedDates.some(d => d.toDateString() === date.toDateString())) {
    this.completedDates.push(date);
    this.calculateStreak();
  }
  return this.save();
};

habitSchema.methods.calculateStreak = function() {
  if (this.completedDates.length === 0) {
    this.streak = 0;
    return;
  }
  
  const sortedDates = this.completedDates
    .map(date => new Date(date))
    .sort((a, b) => b - a);
  
  let currentStreak = 1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Check if the most recent completion was today or yesterday
  const mostRecent = new Date(sortedDates[0]);
  mostRecent.setHours(0, 0, 0, 0);
  
  const daysDiff = Math.floor((today - mostRecent) / (1000 * 60 * 60 * 24));
  
  if (daysDiff > 1) {
    this.streak = 0;
    return;
  }
  
  // Calculate streak based on frequency
  let expectedInterval = 1; // days
  switch (this.frequency) {
    case 'weekly':
      expectedInterval = 7;
      break;
    case 'monthly':
      expectedInterval = 30;
      break;
  }
  
  for (let i = 1; i < sortedDates.length; i++) {
    const current = new Date(sortedDates[i]);
    current.setHours(0, 0, 0, 0);
    const previous = new Date(sortedDates[i - 1]);
    previous.setHours(0, 0, 0, 0);
    
    const daysBetween = Math.floor((previous - current) / (1000 * 60 * 60 * 24));
    
    if (daysBetween <= expectedInterval + 1) { // Allow some flexibility
      currentStreak++;
    } else {
      break;
    }
  }
  
  this.streak = currentStreak;
};

// Pre-save middleware
habitSchema.pre('save', function(next) {
  // Validate tags array length
  if (this.tags && this.tags.length > 10) {
    const error = new Error('Maximum 10 tags allowed');
    error.name = 'ValidationError';
    return next(error);
  }
  
  // Clean up empty tags
  if (this.tags) {
    this.tags = this.tags.filter(tag => tag && tag.trim().length > 0);
  }
  
  next();
});

const Habit = mongoose.model('Habit', habitSchema);
 
export default Habit;