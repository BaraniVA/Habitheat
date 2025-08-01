// Simple file handler for Vercel serverless environment
export const upload = {
  single: (fieldName) => {
    return (req, res, next) => {
      // For now, just pass through - we'll handle file parsing in the controller
      next();
    };
  }
};

