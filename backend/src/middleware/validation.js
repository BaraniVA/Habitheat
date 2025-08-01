import { body, param, query, validationResult } from 'express-validator';

export const validateHabit = [
  body('name')
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('category')
    .isIn(['health', 'productivity', 'learning', 'fitness', 'mindfulness', 'social', 'other'])
    .withMessage('Category must be one of: health, productivity, learning, fitness, mindfulness, social, other'),
  body('frequency')
    .isIn(['daily', 'weekly', 'monthly'])
    .withMessage('Frequency must be one of: daily, weekly, monthly'),
  body('targetValue')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Target value must be between 1 and 1000'),
  body('unit')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Unit must be less than 20 characters'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  body('reminderTime')
    .optional()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Reminder time must be in HH:MM format'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((tags) => {
      if (tags.length > 10) throw new Error('Maximum 10 tags allowed');
      return tags.every(tag => typeof tag === 'string' && tag.length <= 30);
    })
    .withMessage('Each tag must be a string with maximum 30 characters')
];

export const validateHabitUpdate = [
  body('name')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('category')
    .optional()
    .isIn(['health', 'productivity', 'learning', 'fitness', 'mindfulness', 'social', 'other'])
    .withMessage('Category must be one of: health, productivity, learning, fitness, mindfulness, social, other'),
  body('frequency')
    .optional()
    .isIn(['daily', 'weekly', 'monthly'])
    .withMessage('Frequency must be one of: daily, weekly, monthly'),
  body('targetValue')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Target value must be between 1 and 1000'),
  body('unit')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Unit must be less than 20 characters'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  body('reminderTime')
    .optional()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Reminder time must be in HH:MM format'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((tags) => {
      if (tags.length > 10) throw new Error('Maximum 10 tags allowed');
      return tags.every(tag => typeof tag === 'string' && tag.length <= 30);
    })
    .withMessage('Each tag must be a string with maximum 30 characters')
];

export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('category')
    .optional()
    .isIn(['health', 'productivity', 'learning', 'fitness', 'mindfulness', 'social', 'other'])
    .withMessage('Category filter must be valid'),
  query('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive filter must be a boolean')
];

export const validateId = [
  param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer')
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};
