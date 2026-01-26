import Fastify from "fastify";
import { Server, Socket } from "socket.io";
import cors from '@fastify/cors';
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import path from 'path';

// Importação das Configurações e Rotas
import { env } from "./Env";
import { main as seedDefaults } from "./defaults";
import { iniciarVerificacaoPacotesExpirados } from "./Jobs/verificar-pacotes-expirados";

// Rotas
import { UsersRoutes } from "./http/controllers/users/routes";
import { OrderRoutes } from "./http/controllers/orders/routes";
import { AvaliacaoRoutes } from "./http/controllers/avaliacao/routes";
import { FavoritosRoutes } from "./http/controllers/favoritos/routes";
import { InteresseRoutes } from "./http/controllers/interessar/routes";
import { packageRoutes } from "./http/controllers/packages/routes";
import { CarteiraRoutes } from "./http/controllers/carteira/routes";
import { MetricsRoutes } from "./http/controllers/metrics/routes";
import { ProfissionRoutes } from "./http/controllers/profissao/routes";
import { NotificacaoRoutes } from "./http/controllers/notification/routes";
import { VitrineRoutes } from "./http/controllers/vitrine/routes";
import { categoryRoutes } from "./http/controllers/category/routes";

const app = Fastify({
  logger: false, 
});

// 1. REGISTRE O MULTIPART PRIMEIRO (Para evitar o Erro 415)
// REMOVI o multer.contentParser daqui.
app.register(multipart, {
  attachFieldsToBody: false, // Isso permite acessar campos de texto via request.body
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// 2. ARQUIVOS ESTÁTICOS
const uploadPath = path.join(process.cwd(), 'src', 'http', 'controllers', 'uploads');
app.register(fastifyStatic, {
  root: uploadPath,
  prefix: '/uploads/',
});

app.addHook('onRequest', (request, reply, done) => {
  if (request.url.startsWith('/uploads/')) {
    const decodedUrl = decodeURIComponent(request.url);
    request.raw.url = decodedUrl;
  }
  done();
});

// 3. SEGURANÇA E AUTH
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: { cookieName: 'refreshToken', signed: false },
  sign: { expiresIn: '10m' }
});

app.register(fastifyCookie);

app.register(cors, {
  origin: ['https://liberalconnect.org','http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
});

// ... suas outras importações


// --- REFINAMENTO DO SOCKET.IO ---
export let io: Server;

// ... resto do seu código (plugins, rotas, etc)

const start = async () => {
  try {
    await seedDefaults();
    iniciarVerificacaoPacotesExpirados();

    // 2. AGUARDE o Fastify inicializar o servidor interno
    await app.ready();

    io = new Server(app.server, {
      path: "/api/socket.io/", // Mantenha este se quiser usar o prefixo /api
      transports: ['polling', 'websocket'],
      cors: {
        origin: ['http://localhost:5173', 'https://liberalconnect.org'],
        credentials: true,
      },
    });
    
    io.on("connection", (socket) => {
      const userId = socket.handshake.query.userId;
      
      if (!userId) {
        console.error(`❌ Sem userId. ID: ${socket.id}`);
        return socket.disconnect();
      }
    
      socket.join(String(userId));
      console.log(`✅ Usuário ${userId} conectado no socket ${socket.id}`);
    
      // ESCUTE NO SOCKET, NÃO NO IO
      socket.on("register", (id) => {
        socket.join(String(id));
      });
    });

    // 5. Só então inicie o listen
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
    console.log("Servidor rodando 🐱‍🏍");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// --- FIM DO REFINAMENTO ---

// 5. REGISTRO DE ROTAS (Depois dos plugins/parsers)
app.register(UsersRoutes);
app.register(OrderRoutes);
app.register(AvaliacaoRoutes);
app.register(FavoritosRoutes);
app.register(InteresseRoutes);
app.register(packageRoutes);
app.register(CarteiraRoutes);
app.register(MetricsRoutes);
app.register(ProfissionRoutes);
app.register(NotificacaoRoutes);
app.register(VitrineRoutes);
app.register(categoryRoutes);



start();