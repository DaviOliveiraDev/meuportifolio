import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'O e-mail é obrigatório').email('Endereço de e-mail inválido'),
  password: z.string().min(1, 'A senha é obrigatória'),
  remember: z.boolean(),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, 'O nome deve conter pelo menos 2 caracteres').max(100, 'Nome muito longo'),
  username: z
    .string()
    .min(3, 'O nome de usuário deve conter pelo menos 3 caracteres')
    .max(30, 'Nome de usuário muito longo')
    .regex(/^[a-zA-Z0-9_-]+$/, 'O nome de usuário deve conter apenas letras, números, traços (-) e sublinhados (_)'),
  email: z.string().min(1, 'O e-mail é obrigatório').email('Endereço de e-mail inválido'),
  password: z.string().min(8, 'A senha deve conter pelo menos 8 caracteres'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
