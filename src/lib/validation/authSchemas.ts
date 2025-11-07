/**
 * Authentication Validation Schemas
 * Hebrew error messages for all auth forms
 */

import { z } from 'zod';
import { hebrewLocale } from '../locale/he';

const he = hebrewLocale.auth;

/**
 * Login Form Validation Schema
 */
export const loginSchema = z.object({
  email: z.string().email(he.invalidEmail),
  password: z.string().min(6, he.passwordTooShort),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Registration Form Validation Schema
 */
export const registerSchema = z
  .object({
    displayName: z
      .string()
      .min(2, 'שם התצוגה חייב להכיל לפחות 2 תווים')
      .max(50, 'שם התצוגה חייב להכיל פחות מ-50 תווים'),
    email: z.string().email(he.invalidEmail),
    password: z
      .string()
      .min(8, he.passwordTooShort)
      .regex(/[A-Z]/, he.passwordNoUppercase)
      .regex(/[a-z]/, he.passwordNoLowercase)
      .regex(/[0-9]/, he.passwordNoNumber),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: he.passwordsDontMatch,
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Forgot Password Form Validation Schema
 */
export const forgotPasswordSchema = z.object({
  email: z.string().email(he.invalidEmail),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * Reset Password Form Validation Schema
 */
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, he.passwordTooShort)
      .regex(/[A-Z]/, he.passwordNoUppercase)
      .regex(/[a-z]/, he.passwordNoLowercase)
      .regex(/[0-9]/, he.passwordNoNumber),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: he.passwordsDontMatch,
    path: ['confirmPassword'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
