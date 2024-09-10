import { z } from 'zod'

export const NewGuionSchema = z.object({
  nombre: z.string().optional(),
  text: z.string(),
  language: z.string().optional(),
  hook: z.string().optional(),
  contenido: z.string().optional(),
  cta: z.string().optional(),
  tipoCta: z.string().optional(),
  estado: z.string().optional(),
  fecha_uso: z.string().optional(),
  listaGuionId: z.string().optional(),
  userId: z.string().optional()
})

export const NewGuionSchemaWithLista = z.object({
  nombre: z.string().optional(),
  text: z.string(),
  language: z.string().optional(),
  hook: z.string().optional(),
  contenido: z.string().optional(),
  cta: z.string().optional(),
  tipoCta: z.string().optional(),
  estado: z.string().optional(),
  fecha_uso: z.string().optional(),
  listaGuionId: z.string(),
  userId: z.string().optional()
})
