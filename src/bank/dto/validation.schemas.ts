import { z } from 'zod';

export const criarContaCorrenteSchema = z.object({
  titular: z.string().trim().min(3, 'O titular deve ter no mínimo 3 caracteres'),
  saldoInicial: z.number().min(0, 'O saldo inicial não pode ser negativo').optional(),
  limiteChequeEspecial: z.number().min(0, 'O limite do cheque especial não pode ser negativo').optional(),
});

export type CriarContaCorrenteDto = z.infer<typeof criarContaCorrenteSchema>;

export const criarContaPoupancaSchema = z.object({
  titular: z.string().trim().min(3, 'O titular deve ter no mínimo 3 caracteres'),
  saldoInicial: z.number().min(0, 'O saldo inicial não pode ser negativo').optional(),
  taxaRendimento: z.number().min(0, 'A taxa de rendimento não pode ser negativa').max(1, 'A taxa de rendimento não pode ser maior que 1').optional(),
});

export type CriarContaPoupancaDto = z.infer<typeof criarContaPoupancaSchema>;

export const criarContaCorrentePremiumSchema = z.object({
  titular: z.string().trim().min(3, 'O titular deve ter no mínimo 3 caracteres'),
  saldoInicial: z.number().min(0, 'O saldo inicial não pode ser negativo').optional(),
  limiteChequeEspecial: z.number().min(0, 'O limite do cheque especial não pode ser negativo').optional(),
  cashback: z.number().min(0, 'O cashback não pode ser negativo').max(1, 'O cashback não pode ser maior que 1').optional(),
});

export type CriarContaCorrentePremiumDto = z.infer<typeof criarContaCorrentePremiumSchema>;

export const depositoSchema = z.object({
  valor: z.number().positive('O valor do depósito deve ser positivo'),
});

export type DepositoDto = z.infer<typeof depositoSchema>;

export const saqueSchema = z.object({
  valor: z.number().positive('O valor do saque deve ser positivo'),
});

export type SaqueDto = z.infer<typeof saqueSchema>;

export const atualizarContaCorrenteSchema = z.object({
  titular: z.string().trim().min(3, 'O titular deve ter no mínimo 3 caracteres').optional(),
  limiteChequeEspecial: z.number().min(0, 'O limite do cheque especial não pode ser negativo').optional(),
}).refine(data => data.titular !== undefined || data.limiteChequeEspecial !== undefined, {
  message: 'É necessário fornecer ao menos um campo para atualização',
});

export type AtualizarContaCorrenteDto = z.infer<typeof atualizarContaCorrenteSchema>;

export const atualizarContaPoupancaSchema = z.object({
  titular: z.string().trim().min(3, 'O titular deve ter no mínimo 3 caracteres').optional(),
  taxaRendimento: z.number().min(0, 'A taxa de rendimento não pode ser negativa').max(1, 'A taxa de rendimento não pode ser maior que 1').optional(),
}).refine(data => data.titular !== undefined || data.taxaRendimento !== undefined, {
  message: 'É necessário fornecer ao menos um campo para atualização',
});

export type AtualizarContaPoupancaDto = z.infer<typeof atualizarContaPoupancaSchema>;

export const atualizarContaCorrentePremiumSchema = z.object({
  titular: z.string().trim().min(3, 'O titular deve ter no mínimo 3 caracteres').optional(),
  limiteChequeEspecial: z.number().min(0, 'O limite do cheque especial não pode ser negativo').optional(),
  cashback: z.number().min(0, 'O cashback não pode ser negativo').max(1, 'O cashback não pode ser maior que 1').optional(),
}).refine(
  data => data.titular !== undefined || data.limiteChequeEspecial !== undefined || data.cashback !== undefined,
  { message: 'É necessário fornecer ao menos um campo para atualização' }
);

export type AtualizarContaCorrentePremiumDto = z.infer<typeof atualizarContaCorrentePremiumSchema>;
