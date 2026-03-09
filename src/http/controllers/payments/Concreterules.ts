// ─────────────────────────────────────────────────────────────────────────────
//  ConcreteRules.ts — Implementação das 4 regras de recarga
// ─────────────────────────────────────────────────────────────────────────────

import { RechargeContext, RechargeResult, RechargeRule } from "./rechargeRuler";



// ─────────────────────────────────────────────────────────────────────────────
//  REGRA 2 – Grace Period (expirou há ≤ 1 dia)
//  ✔ Recupera moedas antigas + moedas do novo plano + novo prazo
// ─────────────────────────────────────────────────────────────────────────────
export class GracePeriodRechargeRule extends RechargeRule {
  readonly nome = "REGRA_2_GRACE_PERIOD";

  apply(ctx: RechargeContext): RechargeResult {
    return {
      novasMoedas  : ctx.currentCoins + ctx.planCoins,
      novaValidade : this.addDays(ctx.now, ctx.planDays),
      regraaplicada: this.nome,
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  REGRA EXPIRADO (expirou há > 1 dia ou nunca teve plano)
//  ✔ Recebe apenas as moedas do novo plano + novo prazo
// ─────────────────────────────────────────────────────────────────────────────
export class ExpiredRechargeRule extends RechargeRule {
  readonly nome = "REGRA_EXPIRADO";

  apply(ctx: RechargeContext): RechargeResult {
    return {
      novasMoedas  : ctx.planCoins,
      novaValidade : this.addDays(ctx.now, ctx.planDays),
      regraaplicada: this.nome,
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  REGRA 3 & 4 – Plano ainda activo (mesmo plano ou plano diferente)
//  ✔ Moedas somam-se   ✔ Prazos somam-se
// ─────────────────────────────────────────────────────────────────────────────
export class ActivePlanRechargeRule extends RechargeRule {
  readonly nome = "REGRA_3_4_PLANO_ACTIVO";

  apply(ctx: RechargeContext): RechargeResult {
    const diasRestantes = this.diasRestantes(ctx.currentExpiry!, ctx.now);

    return {
      novasMoedas  : ctx.currentCoins + ctx.planCoins,
      novaValidade : this.addDays(ctx.now, diasRestantes + ctx.planDays),
      regraaplicada: this.nome,
    };
  }
}