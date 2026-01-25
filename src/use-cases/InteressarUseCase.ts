  import { CarteiraRepoitory } from "@/repositories/carteira-repository";
  import { resourceNotFoundError } from "@/repositories/errors/resource-not-found";
  import { historicoRepository } from "@/repositories/historico-repository";
  import { InteresseRepository } from "@/repositories/interessar-repository";
  import { NotificationRepository } from "@/repositories/notificacao-repository";
  import { OrderRepository } from "@/repositories/pedidos-repository";
  import { transacaoRepository } from "@/repositories/transaction-repository";
  import { usersRepository } from "@/repositories/users-repository";
  import { io } from "@/server";
  import { Interesse } from "@prisma/client";
  import { Decimal } from "@prisma/client/runtime/library";

  interface InteresseRequest {
    authorId: number;
    pedidoId: number;
  }

  interface InteresseResponse {
    interesse: Interesse;
  }

  export class InteresseUseCase {
    constructor(
      private interesseRepository: InteresseRepository,
      private notificationRepository: NotificationRepository,
      private usersRepository: usersRepository,
      private pedidosRepository: OrderRepository,
      private carteiraRepository: CarteiraRepoitory,
      private recargasRepository: historicoRepository,
      private transacaoRepository:transacaoRepository
    ) {}

    async execute({ authorId, pedidoId }: InteresseRequest): Promise<InteresseResponse> {
      // 🔍 Verifica se o usuário existe
      const user = await this.usersRepository.findById(authorId);
      if (!user) throw new resourceNotFoundError();

      // 🚫 Apenas prestadores podem demonstrar interesse
      if (user.role === "CLIENTE_COLECTIVO" || user.role === "CLIENTE_INDIVIDUAL") {
        throw new Error("Apenas prestadores podem demonstrar interesse em pedidos");
      }

      // 🔍 Verifica se o pedido existe
      const pedido = await this.pedidosRepository.findById(pedidoId);
      if (!pedido) throw new resourceNotFoundError();

      // 🔍 Verifica se já demonstrou interesse
      const isAlreadyInterested = await this.interesseRepository.findByUserAndPedido(authorId, pedidoId);
      if (isAlreadyInterested) throw new Error("Você já demonstrou interesse neste pedido");

      // 🔍 Verifica se há vagas disponíveis
      const NUMERO_MAXIMO_INTERESSADOS = 5;
      const interessados = await this.pedidosRepository.findAnOrderInterested(pedidoId);
      if (interessados?.length === NUMERO_MAXIMO_INTERESSADOS) {
        throw new Error("Pedido já está cheio!");
      }

      // 💰 Verifica saldo na carteira do prestador
      const carteiraPrestador = await this.carteiraRepository.findByUserId(authorId);
      if (!carteiraPrestador) throw new Error("Carteira não encontrada para este usuário");
    
      const valorInteresse = 1000; // kz
      //Habilita-se depois de 6 meses
        // if (Number(carteiraPrestador.receita) < valorInteresse) {
        //   throw new Error("Saldo insuficiente para demonstrar interesse (necessário 1000 Kz)");
        // }

      // ⚙️ Cria o interesse primeiro
      const interesse = await this.interesseRepository.interessar(authorId, pedidoId);
      if (!interesse) {
        throw new Error("Falha ao registrar interesse no pedido");
      }

      // 💸 Agora que o interesse foi criado, faz o desconto
      //Habilita-se depois de 6 meses
      // const novoSaldoPrestador = new Decimal(carteiraPrestador.receita.toNumber() - valorInteresse);
      // await this.carteiraRepository.updateSaldo(carteiraPrestador.id, novoSaldoPrestador);

      const transacao = await this.transacaoRepository.findById(user.id)

      // 🧾 Cria histórico de saída (prestador paga)

      //Habilita-se depois de 6 meses
      // if(transacao){
      //   await this.recargasRepository.create({
      //   carteiraId: carteiraPrestador.id,
      //   valor: new Decimal(valorInteresse),
      //   catergoy: "OUTCOME",
      //   expires_at: null,
      //   isExpired:true,
      //   pacoteId: Number(transacao.pacoteId),
      //   transacaoId: transacao.id,
      // });
      // }
  
      // 💰 Cria histórico de entrada (cliente recebe)
      const carteiraCliente = await this.carteiraRepository.findByUserId(pedido.usuarioId);
      if (carteiraCliente &&  transacao) {
        // const novoSaldoCliente = new Decimal(carteiraCliente.receita.toNumber() + valorInteresse);
        // await this.carteiraRepository.updateSaldo(carteiraCliente.id, novoSaldoCliente);

        // await this.recargasRepository.create({
        //   carteiraId: carteiraCliente.id,
        //   valor: new Decimal(valorInteresse),
        //   catergoy: "INCOME",
        //   expires_at: null,
        //   isExpired:true,
        //   pacoteId: Number(transacao.pacoteId),
        //   transacaoId: transacao.id,
        // });
      }

        if(user.id===pedido.usuarioId){
                    throw Error('can not be intersted on your own order')
            }

      // 🔔 Cria notificação para o dono do pedido
      const content = `O prestador ${user.nome} demonstrou interesse no seu pedido de ${pedido.title}`;
  await this.notificationRepository.Notificar(
    content,
    Number(pedido.usuarioId),
    user.image_path
  );
  const notificacoesCliente = await this.notificationRepository.findMyNotifications(pedido.usuarioId);
  
  io.to(String(pedido.usuarioId)).emit("user", notificacoesCliente);

  const contentParaCliente = `Contacto iniciado com o prestador ${user.nome},para o pedido de ${pedido.title}. Contacto disponível!`;
  await this.notificationRepository.Notificar(
    contentParaCliente,
    Number(pedido.usuarioId),
    user.image_path // Foto do prestador para o cliente ver quem é
  );

  // 🔔 2. Notificação para o PRESTADOR (Quem clicou)
  const contentParaPrestador = `Interesse registrado! O contacto para o pedido "${pedido.title}" foi iniciado com sucesso.`;
  await this.notificationRepository.Notificar(
    contentParaPrestador,
    authorId,
    null // Pode passar um ícone de sistema ou foto do cliente se tiver
  );

  // 📡 ATUALIZAÇÃO VIA SOCKET (Tempo Real)

  // Envia para o Cliente


  // Envia para o Prestador
  const notificacoesPrestador = await this.notificationRepository.findMyNotifications(authorId);
  io.to(String(authorId)).emit("user", notificacoesPrestador);

      // 💬 Atualiza notificações via socket
      const notificacoes = await this.notificationRepository.findMyNotifications(pedido.usuarioId);
      io.to(String(pedido.usuarioId)).emit("user", notificacoes);

      return { interesse };
    }
  }
