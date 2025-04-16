//* packages import
import {z} from 'zod';

//* utils import
import {emailValidation} from '@utils/emailValidation';
import {phoneValidation} from '@utils/phoneValidation';

// Combine them with a union and dynamic refinement
const registerValidation = z
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
          message: 'Must be a valid email or phone number',
        },
      ),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .refine(value => !/\s/.test(value), {
        message: 'Password must not contain spaces',
      })
      .refine(value => /[A-Z]/.test(value), {
        message: 'Password must contain at least one uppercase letter',
      })
      .refine(value => /[a-z]/.test(value), {
        message: 'Password must contain at least one lowercase letter',
      })
      .refine(value => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
        message: 'Password must contain at least one special character',
      }),
    confirmPassword: z
      .string()
      .min(6, 'Confirm password must be at least 6 characters')
      .refine(value => !/\s/.test(value), {
        message: 'Confirm password must not contain spaces',
      })
      .refine(value => /[A-Z]/.test(value), {
        message: 'Confirm password must contain at least one uppercase letter',
      })
      .refine(value => /[a-z]/.test(value), {
        message: 'Confirm password must contain at least one lowercase letter',
      })
      .refine(value => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
        message: 'Confirm password must contain at least one special character',
      }),
  })
  .refine(
    registerParams =>
      !registerParams.password.includes(registerParams.emailOrPhone),
    {
      message: 'Password must not include your email or phone',
    },
  )
  .refine(
    registerParams =>
    registerParams.password === registerParams.confirmPassword,
    {
      path: ['confirmPassword'],
      message: "Password don't match",
    },
  );

export default registerValidation;
