import {z} from 'zod';

const phoneRegex = /^(00962[0-9]{9}|\+962[0-9]{9}|07[0-9]{8})$/;
// Define phone schema
export const phoneValidation = (phone: string | undefined) =>
  z
    .string()
    .regex(
      phoneRegex,
      'Must be a valid phone number in the format 00962XXXXXXXX, +962XXXXXXXX, or 07XXXXXXXX',
    )
    .safeParse(phone);
