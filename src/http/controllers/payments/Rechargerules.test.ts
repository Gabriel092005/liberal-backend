// recharge/__tests__/RechargeRules.test.ts
// Corre com: npx vitest run RechargeRules

import { describe, test, expect } from "vitest";
import { RechargeContext } from "./rechargeRuler";
import { RechargeRuleFactory } from "./rechargeFactory";

// ─── Helper ───────────────────────────────────────────────────────────────────
function ctx(overrides: Partial<RechargeContext> = {}): RechargeContext {
  const now = new Date("2025-01-15T12:00:00Z");
  return {
    currentCoins: 100,
    currentExpiry: null,
    planCoins: 50,
    planDays: 30,
    now,
    ...overrides,
  };
}

function daysFromNow(days: number, base = new Date("2025-01-15T12:00:00Z")): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

// ─── REGRA 2 – Grace Period (expirou há ≤ 1 dia) ─────────────────────────────
describe("REGRA 2 – Grace Period", () => {
  test("expirou exactamente ontem → recupera moedas antigas + novas", () => {
    const c = ctx({ currentExpiry: daysFromNow(-1) });
    const rule = RechargeRuleFactory.create(c);
    const result = rule.apply(c);

    expect(rule.nome).toBe("REGRA_2_GRACE_PERIOD");
    expect(result.novasMoedas).toBe(150); // 100 antigas + 50 novas
    expect(result.novaValidade).toEqual(daysFromNow(30)); // novo prazo a partir de hoje
  });

  test("expirou há 12 horas → ainda grace period", () => {
    const expirou = new Date("2025-01-15T00:00:00Z"); // 12h atrás
    const c = ctx({ currentExpiry: expirou });
    const rule = RechargeRuleFactory.create(c);

    expect(rule.nome).toBe("REGRA_2_GRACE_PERIOD");
  });
});

// ─── EXPIRADO HÁ MUITO ────────────────────────────────────────────────────────
describe("Plano expirado há muito tempo (> 1 dia)", () => {
  test("expirou há 5 dias → só recebe moedas do novo plano", () => {
    const c = ctx({ currentExpiry: daysFromNow(-5) });
    const rule = RechargeRuleFactory.create(c);
    const result = rule.apply(c);

    expect(rule.nome).toBe("REGRA_EXPIRADO");
    expect(result.novasMoedas).toBe(50); // só as novas, sem recuperar as antigas
    expect(result.novaValidade).toEqual(daysFromNow(30));
  });

  test("plano nunca existiu (null) → só recebe moedas do novo plano", () => {
    const c = ctx({ currentExpiry: null, currentCoins: 0 });
    const rule = RechargeRuleFactory.create(c);
    const result = rule.apply(c);

    expect(rule.nome).toBe("REGRA_EXPIRADO");
    expect(result.novasMoedas).toBe(50);
  });
});

// ─── REGRA 3 – Mesmo plano, ainda activo ─────────────────────────────────────
describe("REGRA 3 – Plano activo, mesmo pacote", () => {
  test("ainda tem 15 dias → soma moedas e soma prazos", () => {
    const c = ctx({ currentExpiry: daysFromNow(15) });
    const rule = RechargeRuleFactory.create(c);
    const result = rule.apply(c);

    expect(rule.nome).toBe("REGRA_3_4_PLANO_ACTIVO");
    expect(result.novasMoedas).toBe(150); // 100 + 50
    // 15 dias restantes + 30 do plano = 45 dias a partir de hoje
    expect(result.novaValidade).toEqual(daysFromNow(45));
  });

  test("ainda tem 1 dia → soma moedas e soma prazos", () => {
    const c = ctx({ currentExpiry: daysFromNow(1) });
    const rule = RechargeRuleFactory.create(c);
    const result = rule.apply(c);

    expect(result.novasMoedas).toBe(150);
    expect(result.novaValidade).toEqual(daysFromNow(31));
  });
});

// ─── REGRA 4 – Plano diferente, ainda activo ─────────────────────────────────
describe("REGRA 4 – Plano activo, pacote diferente (ex: upgrade)", () => {
  test("upgrade de 50 para 200 moedas com 20 dias restantes", () => {
    const c = ctx({
      currentCoins: 80,
      currentExpiry: daysFromNow(20),
      planCoins: 200,
      planDays: 60,
    });
    const rule = RechargeRuleFactory.create(c);
    const result = rule.apply(c);

    expect(rule.nome).toBe("REGRA_3_4_PLANO_ACTIVO");
    expect(result.novasMoedas).toBe(280); // 80 + 200
    expect(result.novaValidade).toEqual(daysFromNow(80)); // 20 + 60
  });
});

// ─── REGRA 1 – Moedas só descontam quando cliente confirma ───────────────────
// Esta regra é validada no handler de "confirmar negociação", não aqui.
// Mas podemos garantir que a aprovação NÃO desconta moedas.
describe("REGRA 1 – Aprovação nunca desconta moedas", () => {
  test("aprovação sempre soma ou mantém as moedas, nunca desconta", () => {
    const casos = [
      ctx({ currentExpiry: null, currentCoins: 0 }),
      ctx({ currentExpiry: daysFromNow(-5) }),
      ctx({ currentExpiry: daysFromNow(-1) }),
      ctx({ currentExpiry: daysFromNow(10) }),
    ];

    for (const c of casos) {
      const rule = RechargeRuleFactory.create(c);
      const result = rule.apply(c);
      expect(result.novasMoedas).toBeGreaterThanOrEqual(c.planCoins);
    }
  });
});

// ─── Validade nunca retroage ──────────────────────────────────────────────────
describe("Sanidade – validade nunca é no passado", () => {
  test("em todos os cenários a nova validade é futura", () => {
    const agora = new Date("2025-01-15T12:00:00Z");
    const casos = [
      ctx({ currentExpiry: null }),
      ctx({ currentExpiry: daysFromNow(-10) }),
      ctx({ currentExpiry: daysFromNow(-1) }),
      ctx({ currentExpiry: daysFromNow(5) }),
    ];

    for (const c of casos) {
      const rule = RechargeRuleFactory.create(c);
      const result = rule.apply(c);
      expect(result.novaValidade.getTime()).toBeGreaterThan(agora.getTime());
    }
  });
});