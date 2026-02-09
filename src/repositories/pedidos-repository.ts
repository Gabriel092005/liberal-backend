
import { Brevidade, Pedido, Prisma, STATUS, Usuario }  from "@prisma/client";



// supondo que seus enums estão aqui

// Tipo do autor do pedido
type Autor = {
  nome: string;
  image_path: string | null;
};

// Tipo principal do pedido
export type PedidoTypes = {
  id: number;
  created_at: Date;
  image_path: string | null;
  title: string;
  content: string;
  brevidade: Brevidade;
  status: STATUS;
  location: string;
  latitude: number;
  longitude: number;
  usuarioId: number;
  autor: Autor;
} | null;

interface interessados{
    id: number;
    prestadorId: number;
    pedidoId: number;
}

export interface PrestadorInfo {
  id:number
  nome: string;
  foto: string | null;
}

export interface PedidoPendenteInfo {
  id: number;
  titulo: string;
  totalInteressados: number;
  mensagem: string;
  statusPedido: STATUS;
  prestadoresEncontrados: PrestadorInfo[];
}

export interface RespostaPedidosPendentes {
  quantidadeTotal: number;
  pedidos: PedidoPendenteInfo[];
}

export interface OrderRepository {
    delete(id:number):Promise<null>
    fecharPedido(authorId:number, pedidoId:number):Promise<null>
    AcceptedOrder(costumerId:number,orderId:number ):Promise<null>
    getPedidosStatus(usuarioId: number): Promise<RespostaPedidosPendentes>;
    RevokeOrder(costumerId:number,orderId:number):Promise<null>
    findAnOrderInterested(pedidoId:number):Promise<interessados[]|undefined>
    concluirPedidoPrestador(prestadorId:number, orderId:number) : Promise<number>
    Create(data : Prisma.PedidoCreateInput) : Promise<Pedido>
    findAllOrders(query?:string):Promise<Pedido[]>
    FindMyOrders(authorId:number,query:string|undefined):Promise<Pedido[]>
    findById(pedidoId:number):Promise<PedidoTypes>
    fetchNearOrder(latitue:number, longitude:number):Promise<Pedido[]>
}
