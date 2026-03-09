import prisma from "@/lib/prisma";


export class ExpirationService {
  private intervalMs: number;
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(
    intervalMs = 60 * 60 * 1000 // ← de hora em hora em produção
    // intervalMs = 1000          // ← 1 segundo para testes
  ) {
    this.intervalMs = intervalMs;
  }

  // Arranca o job — chamar no onReady do servidor
  start() {
    console.log("[ExpirationService] ✅ A iniciar...");
    this.runCheck(); // corre imediatamente ao arrancar
    this.timer = setInterval(() => this.runCheck(), this.intervalMs);
  }

  // Para o job — chamar no onClose do servidor
  stop() {
    if (this.timer) clearInterval(this.timer);
    console.log("[ExpirationService] 🛑 Parado.");
  }

  // Público para poder ser chamado manualmente (ex: rota de debug)
  async runCheck() {
    const agora = new Date();

    try {
      // 1. Busca históricos cujo expires_at já passou e ainda não foram removidos
      const historicosExpirados = await prisma.historicoRecargas.findMany({
        where: {
          isExpired : false,
          expires_at: { lt: agora },
        },
        select: {
          id        : true,
          valor     : true,
          carteiraId: true,
          carteira  : {
            select: { usuarioId: true, receita: true },
          },
        },
      });

      if (historicosExpirados.length === 0) return;

      console.log(`[ExpirationService] 🔍 ${historicosExpirados.length} plano(s) a expirar.`);

      // 2. Processa cada histórico individualmente
      for (const historico of historicosExpirados) {
        try {
          await prisma.$transaction([

            // ✅ Subtrai só o valor DESTE plano (não zera tudo)
            prisma.carteira.update({
              where: { id: historico.carteiraId },
              data : { receita: { decrement: historico.valor } },
            }),

            // ✅ Remove o histórico expirado
            prisma.historicoRecargas.delete({
              where: { id: historico.id },
            }),

            // Notifica o prestador
            prisma.notificacao.create({
              data: {
                content: `O teu plano expirou (${historico.valor} moedas). Renova para continuar a receber contactos.`,
                authrId: historico.carteira.usuarioId,
              },
            }),

          ]);

          console.log(
            `[ExpirationService] ✅ Histórico ${historico.id} removido.` +
            ` Subtraiu ${historico.valor} moedas da carteira ${historico.carteiraId}.`
          );

        } catch (err) {
          console.error(`[ExpirationService] ❌ Erro no histórico ${historico.id}:`, err);
        }
      }

    } catch (err) {
      console.error("[ExpirationService] ❌ Erro geral:", err);
    }
  }
}

// Singleton — importa e usa em todo o projecto
export const expirationService = new ExpirationService();