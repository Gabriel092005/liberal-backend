// // recharge/__tests__/aprovarPagamento.integration.test.ts
// // Corre com: npx vitest run aprovarPagamento.integration

// import { describe, test, expect, vi, beforeEach } from "vitest";
// import { aprovarPagamento } from "./approvar";


// // ── Mock do Prisma (sem precisar de base de dados real) ───────────────────────
// const mockPrisma = {
//   transacao: { findUnique: vi.fn(), update: vi.fn() },
//   carteira: { findUnique: vi.fn(), update: vi.fn() },
//   historicoRecargas: { create: vi.fn() },
//   notificacao: { create: vi.fn() },
//   $transaction: vi.fn(async (ops: any[]) => Promise.all(ops)),
// };

// vi.mock("@/lib/prisma", () => ({ default: mockPrisma }));

// // ── Helpers ───────────────────────────────────────────────────────────────────
// function makeReq(transacaoId: number) {
//   return { body: { transacaoId } } as any;
// }

// function makeRes() {
//   const res = { status: jest.fn(), send: jest.fn() } as any;
//   res.status.mockReturnValue(res); // permite encadear .send()
//   return res;
// }

// function daysFromNow(days: number): Date {
//   const d = new Date();
//   d.setDate(d.getDate() + days);
//   return d;
// }

// // ── Setup default mocks ───────────────────────────────────────────────────────
// const pacoteMock = { id: 1, preco: 50, validade: "30", title: "Básico" };

// beforeEach(() => {
//   vi.clearAllMocks();

//   mockPrisma.transacao.findUnique.mockResolvedValue({
//     id: 1,
//     status: "PENDENTE",
//     carteiraId: 10,
//     usuarioId: 99,
//     pacoteId: 1,
//     valor: 500,
//     pacote: pacoteMock,
//   });

//   mockPrisma.$transaction.mockImplementation(async (ops: any[]) => Promise.all(ops));
// });

// // ─── Testes ───────────────────────────────────────────────────────────────────

// describe("aprovarPagamento – plano nunca existiu", () => {
//   test("deve atribuir moedas do plano e criar validade futura", async () => {
//     mockPrisma.carteira.findUnique.mockResolvedValue({
//       id: 10, usuarioId: 99, receita: 0, expiraEm: null,
//     });

//     const res = makeRes();
//     await aprovarPagamento(makeReq(1), res);

//     const [, carteiraUpdate] = mockPrisma.$transaction.mock.calls[0][0];
//     const data = carteiraUpdate?.data ?? carteiraUpdate;

//     expect(res.send).toHaveBeenCalledWith(
//       expect.objectContaining({ moedas: 50 })
//     );
//   });
// });

// describe("aprovarPagamento – plano ainda activo", () => {
//   test("deve somar moedas e estender prazo", async () => {
//     mockPrisma.carteira.findUnique.mockResolvedValue({
//       id: 10, usuarioId: 99, receita: 100, expiraEm: daysFromNow(10),
//     });

//     const res = makeRes();
//     await aprovarPagamento(makeReq(1), res);

//     expect(res.send).toHaveBeenCalledWith(
//       expect.objectContaining({ moedas: 150 }) // 100 + 50
//     );
//   });
// });

// describe("aprovarPagamento – já processada", () => {
//   test("deve retornar 400", async () => {
//     mockPrisma.transacao.findUnique.mockResolvedValue({
//       id: 1, status: "APROVADO", carteiraId: 10, usuarioId: 99,
//       pacoteId: 1, valor: 500, pacote: pacoteMock,
//     });

//     const res = makeRes();
//     await aprovarPagamento(makeReq(1), res);

//     expect(res.status).toHaveBeenCalledWith(400);
//   });
// });

// describe("aprovarPagamento – transação não existe", () => {
//   test("deve retornar 404", async () => {
//     mockPrisma.transacao.findUnique.mockResolvedValue(null);

//     const res = makeRes();
//     await aprovarPagamento(makeReq(999), res);

//     expect(res.status).toHaveBeenCalledWith(404);
//   });
// });