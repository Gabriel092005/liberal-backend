

import { Interesse}  from "@prisma/client";

import { STATUS, Brevidade, STATUS_INTERESTED } from "@prisma/client";

export interface PedidoComDetalhes {
  id: number;
  created_at: Date;
  status: STATUS;
  title: string;
  content: string;
  image_path: string | null;
  brevidade: Brevidade;
  location: string;
  latitude: number;
  longitude: number;
  usuarioId: number;
}
export interface InteresseComPedido {
  id: number;
  prestadorId: number;
  pedidoId: number;
  status: STATUS_INTERESTED;
  pedido: PedidoComDetalhes;
}




export interface InteresseRepository {
    interessar(prestadorId:number, orderId:number) : Promise<Interesse>
    findAllByPrestador(prestadorId:number):Promise<InteresseComPedido[]>
    findByUserAndPedido(userId: number, pedidoId: number):Promise<Interesse|null>
}
