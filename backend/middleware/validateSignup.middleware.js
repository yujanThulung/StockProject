import {body, validationResult} from 'express-validator';


export const validateSignup = [
    body("name")
    .notEmpty()
    .withMessage("Name is required")
    .matches(/[a-zA-Z]/)
    .withMessage("Name must contain at least one alphabet character")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can only contain letters and spaces"),

    body("email")
    .notEmpty()
    .isEmail()
    .withMessage("Invalid email address"),


    
    body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[@$!%*?&]/)
    .withMessage("Password must contain at least one special character"),


     body("role")
    .isIn(["user", "admin"])
    .withMessage("Invalid role. Role must be 'user' or 'admin'."),

  // Check for validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];