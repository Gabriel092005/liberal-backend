import { CarteiraRepoitory } from "@/repositories/carteira-repository";

interface ListarHistoricoPacotesUseCaseRequest {
  usuarioId: number;
}

export class ListarHistoricoPacotesUseCase {
  constructor(private carteiraRepository: CarteiraRepoitory) {}

  async execute({ usuarioId }: ListarHistoricoPacotesUseCaseRequest) {

    const carteira = await this.carteiraRepository.findByUserId(usuarioId);
    if (!carteira) throw new Error("Carteira não encontrada para este usuário.");
    const saldoAtual = Number(carteira.receita ?? 0);
    const historico = await this.carteiraRepository.findAllPackagesHistory(carteira.id);
    const agora = new Date();
    const ativos = historico.filter(
      h => h.catergoy === "INCOME" && h.expires_at && new Date(h.expires_at) > agora
    );
    if (ativos.length === 0) {
      return {
        carteira: {
          id: carteira.id,
          saldo_atual: saldoAtual
        },
        pacotes_ativos: [],
        totalAtivo: 0,
        saldo_livre: saldoAtual
      };
    }
    // Agrupar por nome + validade
    const agrupados = ativos.reduce((acc, item) => {
      const chave = `${item.pacote.title}::${item.pacote.validade ?? ""}`;
      if (!acc[chave]) {
        acc[chave] = {
          nome: item.pacote.title,
          validade: item.pacote.validade ?? null,
          totalComprado: 0
        };
      }
      acc[chave].totalComprado += Number(item.valor);
      return acc;
    }, {} as Record<string, { nome: string; validade: string | null; totalComprado: number }>);

    const pacotes = Object.values(agrupados);
    const somaTotal = pacotes.reduce((s, p) => s + p.totalComprado, 0);

    // 🧠 Ajuste principal: limitar ao saldo atual
    const fatorReducao = somaTotal > 0 ? saldoAtual / somaTotal : 0;

    const pacotes_ativos = pacotes.map(p => {
      // Se o total dos pacotes for maior que o saldo, reduz proporcionalmente
      const totalCorrigido = Number((p.totalComprado * fatorReducao).toFixed(2));
      return {
        nome: p.nome,
        validade: p.validade ? `${p.validade} dias` : null,
        total: totalCorrigido
      };
    });

    const totalAtivo = pacotes_ativos.reduce((s, p) => s + p.total, 0);
    const saldo_livre = Number((saldoAtual - totalAtivo).toFixed(2));

    return {
      carteira: {
        id: carteira.id,
        saldo_atual: saldoAtual 
      },
      pacotes_ativos,
      totalAtivo,
      saldo_livre
    };
  }
}
