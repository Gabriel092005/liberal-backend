import { OrderRepository, PedidoPendenteInfo, RespostaPedidosPendentes } from "@/repositories/pedidos-repository";

// src/useCases/GetPedidosStatusUseCase.ts
export class GetPedidosStatusUseCase {
    constructor(private pedidoRepository: OrderRepository) {}
  
    async execute(usuarioId: number): Promise<RespostaPedidosPendentes> {
      const pedidosRaw = await this.pedidoRepository.getPedidosStatus(usuarioId);
  
      const pedidosFormatados: PedidoPendenteInfo[] = pedidosRaw.pedidos.map(pedido => {
      const totalInteressados = pedido.totalInteressados
        
        return {
          id: pedido.id,
          titulo: pedido.titulo,
          totalInteressados,
          statusPedido: pedido.statusPedido as 'PENDING',
          mensagem: totalInteressados > 0 
            ? `Encontrámos ${totalInteressados} profissional(ais) para o seu pedido!`
            : `Estamos procurando prestadores para o pedido de ${pedido.titulo}...`,
          prestadoresEncontrados: pedido. prestadoresEncontrados.map((i) => ({
            id:i.id,
            nome: i.nome,
            foto: i.foto
          }))
        };
      });
  
      return {
        quantidadeTotal: pedidosFormatados.length,
        pedidos: pedidosFormatados
      };
    }
  }