// ─────────────────────────────────────────────────────────────────────────────
//  RechargeRule.ts — Contrato base para todas as regras de recarga
// ─────────────────────────────────────────────────────────────────────────────

export interface RechargeContext {
  currentCoins: number;       // receita actual na carteira
  currentExpiry: Date | null; // expiraEm actual (null = nunca teve plano)
  planCoins: number;          // moedas do pacote comprado
  planDays: number;           // validade em dias do pacote
  now: Date;
}

export interface RechargeResult {
  novasMoedas: number;
  novaValidade: Date;
  regraaplicada: string;
}

export abstract class RechargeRule {
  abstract readonly nome: string;
  abstract apply(ctx: RechargeContext): RechargeResult;

  protected addDays(base: Date, days: number): Date {
    const d = new Date(base);
    d.setDate(d.getDate() + days);
    return d;
  }

  protected diasRestantes(expiry: Date, now: Date): number {
    return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  }
}