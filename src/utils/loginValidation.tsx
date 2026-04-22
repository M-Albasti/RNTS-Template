//* packages import
import { z } from 'zod';

//* utils import
import { emailValidation } from '@utils/emailValidation';
import { phoneValidation } from '@utils/phoneValidation';

// Combine them with a union and dynamic refinement
const loginValidation = z
  .object({
    emailOrPhone: z
      .string()
      .min(1, 'Email or phone number is required')
      .refine(
        (value: string) => {
          if (emailValidation(value).success) {
            return emailValidation(value).success; // Validate as email
          }
          if (phoneValidation(value).success) {
            return phoneValidation(value).success; // Validate as phone
          }
          return false; // Invalid format
        },
        {
          error: 'Must be a valid email or phone number',
        },
      ),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .refine(value => !/\s/.test(value), {
        error: 'Password must not contain spaces',
      })
      .refine(value => /[A-Z]/.test(value), {
        error: 'Password must contain at least one uppercase letter',
      })
      .refine(value => /[a-z]/.test(value), {
        error: 'Password must contain at least one lowercase letter',
      })
      .refine(value => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
        error: 'Password must contain at least one special character',
      }),
  })
  .refine(
    loginParams => !loginParams.password.includes(loginParams.emailOrPhone),
    {
      error: 'Password must not include your email or phone',
    },
  );

export default loginValidation;
