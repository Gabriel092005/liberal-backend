import cron from "node-cron";
import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "@/lib/prisma";
import { PrismaCarteira } from "@/repositories/prisma/prisma-carteira-repository";
import { io } from "@/server";

const carteiraRepository = new PrismaCarteira();

export function iniciarVerificacaoPacotesExpirados() {

  cron.schedule("*/1 * * * *", async () => {
    console.log("🕛 Iniciando verificação de pacotes expirados...");

    const agora = new Date();

    try {
      // 1️⃣ Buscar históricos ativos com validade vencida
      const historicosExpirados = await prisma.historicoRecargas.findMany({
        where: {
          isExpired:true,
          expires_at: { lte: agora },
        },
        include: {
          carteira: true,
          pacote: true,
        },
      });

      console.log('epirados:',historicosExpirados)

      if (historicosExpirados.length === 0) {
        console.log("✅ Nenhum pacote expirado encontrado.");
        return;
      }

      console.log(`⚙️ Processando ${historicosExpirados.length} pacotes expirados...`);

      for (const historico of historicosExpirados) {
        const { carteira, pacote } = historico;
        if (!carteira || !pacote) continue;

        await prisma.$transaction(async (tx) => {
          // 2️⃣ Calcular novo saldo
          const saldoAtual = new Decimal(carteira.receita);
          const novoSaldo = saldoAtual.minus(pacote.preco);

          if (novoSaldo.lessThan(0)) {
            console.warn(`⚠️ Carteira ${carteira.id} ficaria negativa (${novoSaldo}). Ignorado.`);
            return;
          }

          // 3️⃣ Atualizar saldo da carteira
          await tx.carteira.update({
            where: { id: carteira.id },
            data: { receita: novoSaldo },
          });

          // 4️⃣ Criar transação de débito automático
          const transacao = await tx.transacao.create({
            data: {
              usuarioId: carteira.usuarioId,
              carteiraId: carteira.id,
              pacoteId: pacote.id,
              valor: pacote.preco,
              metodo: "AUTOMATIC_DEBIT",
              status: "APROVADO",
              referencia: `EXP-${Date.now()}`,
            },
          });

          // 5️⃣ Marcar histórico original do pacote como expirado
          await tx.historicoRecargas.update({
            where: { id: historico.id },
            data: {
              isExpired: true,
              transacaoId: transacao.id,
              expires_at: agora,
            },
          });

          // 6️⃣ Criar histórico de saída (OUTCOME)
          await tx.historicoRecargas.create({
            data: {
              carteiraId: carteira.id,
              pacoteId: pacote.id,
              valor: pacote.preco,
              catergoy: "OUTCOME",
              expires_at: agora,
              transacaoId: transacao.id,
            },
          });

          // 7️⃣ Criar notificação no banco
          const notificacao = await tx.notificacao.create({
            data: {
              authrId: carteira.usuarioId, // usuário destinatário
              content: `Seu plano "${pacote.title}" expirou e foi debitado automaticamente.`,
            },
          });

          // 8️⃣ Enviar notificação em tempo real via Socket.IO
          io.to(`user-${carteira.usuarioId}`).emit("novaNotificacao", notificacao);

          console.log(
            `💸 Pacote "${pacote.title}" expirado (Carteira ${carteira.id}) — débito ${pacote.preco}`
          );
        });
      }

      console.log("✅ Verificação de pacotes expirados concluída com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao verificar pacotes expirados:", error);
    }
  });
}
