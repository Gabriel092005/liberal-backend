import { CarteiraRepoitory } from "@/repositories/carteira-repository";
import { historicoRepository } from "@/repositories/historico-repository";
import { pacotesRepository } from "@/repositories/pacotes-repository";
import { transacaoRepository } from "@/repositories/transaction-repository";
import { Decimal } from "@prisma/client/runtime/library";

interface RecarregarCarteiraRequest {
  usuarioId: number;
  pacoteId: number;
  metodo: string;
}

export class RecarregarCarteiraUseCase {
  constructor(
    private carteiraRepository: CarteiraRepoitory,
    private transacaoRepository: transacaoRepository,
    private pacotesRepository: pacotesRepository,
    private historicoRepository: historicoRepository
  ) {}

  async execute({ metodo, pacoteId, usuarioId }: RecarregarCarteiraRequest) {
    // 1. Buscar dados básicos

      console.log("carregarrrrrrrrrrrrrrrrrrrrrrrrrrr:",metodo)
  
    const carteira = await this.carteiraRepository.FindDigitalCardDates(usuarioId);


    if (!carteira) throw new Error("Você não possui carteira digital.");

    const pacote = await this.pacotesRepository.findPacote(pacoteId);
    if (!pacote) throw new Error("Pacote não encontrado.");

    // 2. Converter validade (String "5" -> Number 5)
    const diasValidade = parseInt(pacote.validade);
    if (isNaN(diasValidade)) throw new Error("Configuração de validade do pacote inválida.");
    
    const validadeMs = diasValidade * 24 * 60 * 60 * 1000;
    const agora = new Date();
    let novaDataExpiracao: Date;

    // --- APLICAÇÃO DAS REGRAS DE DATA ---

    // REGRA 3: Se recarregar antes de expirar, o novo prazo soma ao que restava
    if (carteira.ExpiraEm && carteira.ExpiraEm > agora) {
      novaDataExpiracao = new Date(carteira.ExpiraEm.getTime() + validadeMs);
    } else {
      // REGRA 2: Se expirou (ontem ou antes), o novo prazo começa de HOJE
      // O saldo antigo "recuperado" já está em 'carteira.receita'
      novaDataExpiracao = new Date(agora.getTime() + validadeMs);
    }

    // REGRA 2, 3 e 4: Moedas sempre se somam
    const novoSaldo = new Decimal(carteira.receita).plus(pacote.preco);

    // --- PERSISTÊNCIA ---

    // 1. Registrar Transação
    const transacao = await this.transacaoRepository.create({
      usuarioId,
      carteiraId: carteira.id,
      pacoteId: pacote.id,
      valor: pacote.preco,
      metodo,
      status: "COMPLETED",
    });

    // 2. Registrar no Histórico (Para auditoria e controle de expiração)
    await this.historicoRepository.create({
      carteiraId: carteira.id,
      pacoteId: pacote.id,
      valor: pacote.preco,
      catergoy: "INCOME",
      expires_at: new Date('2026-02-16T08:05:42.398Z'),
      transacaoId: transacao.id,
      isExpired: false,
    });

    // 3. Atualizar a Carteira (Saldo + Nova Data de Expiração)
    // Nota: Certifique-se de que seu repository aceite o segundo parâmetro 'expiraEm'
    await this.carteiraRepository.updateSaldoEValidade(carteira.id, novoSaldo, novaDataExpiracao);

    return {
      message: "Recarga efetuada com sucesso",
      saldoAnterior: carteira.receita,
      novoSaldo,
      expiraEm: novaDataExpiracao,
    };
  }
}