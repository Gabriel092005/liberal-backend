

// ──────────────────────────────────────────────────────────────────────────
//  FACTORY – Decide qual regra aplicar com base no estado actual da carteira

import { ActivePlanRechargeRule, ExpiredRechargeRule, GracePeriodRechargeRule } from "./Concreterules";
import { RechargeContext, RechargeRule } from "./rechargeRuler";


// ─────────────────────────────────────────────────────────────────────────────
//  RechargeRuleFactory.ts — Decide qual regra aplicar
// ─────────────────────────────────────────────────────────────────────────────



export class RechargeRuleFactory {
  static create(ctx: RechargeContext): RechargeRule {
    const { currentExpiry, now } = ctx;

    // Plano nunca existiu ou já expirou
    if (!currentExpiry || currentExpiry < now) {
      if (currentExpiry) {
        const diasPassados =
          (now.getTime() - currentExpiry.getTime()) / (1000 * 60 * 60 * 24);

        // Expirou há ≤ 1 dia → Grace Period (Regra 2)
        if (diasPassados <= 1) return new GracePeriodRechargeRule();
      }

      // Nunca teve plano ou expirou há > 1 dia
      return new ExpiredRechargeRule();
    }

    // Plano ainda activo → Regras 3 & 4
    return new ActivePlanRechargeRule();
  }
}