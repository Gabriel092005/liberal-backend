import { PrismaCarteira } from "@/repositories/prisma/prisma-carteira-repository";
import { PrismaTransacaoRepository } from "@/repositories/prisma/prisma-Transaction-repository";
import { Decimal } from "@prisma/client/runtime/library";

export class RecargaService {
  constructor(
    private carteiraRepo: PrismaCarteira,
    private transacaoRepo: PrismaTransacaoRepository
  ) {}

  async executarRecarga(userId: number, novoPacote: any) {
    const carteira = await this.carteiraRepo.findByUserId(userId);
    if (!carteira) throw new Error("Carteira não encontrada");

    const agora = new Date();
    let novoSaldoMoedas: Decimal;
    let novaDataExpiracao: Date;

    const saldoAtual = new Decimal(carteira.receita || 0);
    const moedasDoPacote = new Decimal(novoPacote.moedas);

    // REGRA 3: Renovação ANTES de expirar
    if (carteira.expiraEm && carteira.expiraEm > agora) {
      // Soma moedas + Soma prazos (Data atual da carteira + dias do pacote)
      novoSaldoMoedas = saldoAtual.plus(moedasDoPacote);
      novaDataExpiracao = this.adicionarDias(carteira.expiraEm, novoPacote.duracaoDias);
    } 
    
    // REGRA 2: Renovação APÓS expirar (Ex: expirou ontem, carregou hoje)
    else {
      // Recupera moedas que restaram + novas moedas
      novoSaldoMoedas = saldoAtual.plus(moedasDoPacote);
      // Novo prazo começa a contar de AGORA
      novaDataExpiracao = this.adicionarDias(agora, novoPacote.duracaoDias);
    }

    // REGRA 4: Se for plano diferente, a lógica de validade acima 
    // já garante que o "novo prazo" passe a valer (novoPrazo + residual ou novoPrazo puro)

    // Atualiza a Carteira
    await this.carteiraRepo.updateSaldo(carteira.id, novoSaldoMoedas);
    
    // Aqui você precisaria de um método updateExpiracao no seu repo:
    // await this.carteiraRepo.updateExpiracao(carteira.id, novaDataExpiracao);
  }

  private adicionarDias(data: Date, dias: number): Date {
    const novaData = new Date(data);
    novaData.setDate(novaData.getDate() + dias);
    return novaData;
  }
}