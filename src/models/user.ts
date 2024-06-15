import { z } from 'zod'

export const NewUserSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: 'El email no puede ser vacio'
    })
    .email(),
  password: z.string().min(1, {
    message: 'La password no puede ser vacia'
  }),
  role: z.string().optional().default('User'),
  name: z.string().optional()
})
