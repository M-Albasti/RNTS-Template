import { z } from 'zod';

// Define email schema
export const emailValidation = (email: string | undefined) =>
  z.email('Must be a valid email').safeParse(email);
