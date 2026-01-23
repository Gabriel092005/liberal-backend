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
  logger: true, 
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

export const io = new Server(app.server, {
  path: "/socket.io/",
  cors: {
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:5173',
        'https://liberalconnect.org',
        'https://www.liberalconnect.org'
      ];
      
      // Permite se a origem estiver na lista ou se for uma requisição sem origin (como o seu teste no navegador)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // ESSA LINHA É A CHAVE: Ela vai te mostrar no 'pm2 logs' quem o navegador está enviando
        console.warn(`⚠️ Origem bloqueada pelo CORS: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST"]
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ['websocket', 'polling'],
  allowEIO3: true
});

// Middleware de Autenticação (Opcional, mas recomendado)
// Isso impede conexões de usuários não logados se você enviar o Token no "auth" do client
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  // Aqui você poderia validar o JWT se quisesse segurança máxima no Socket
  // if (token_invalido) return next(new Error("Não autorizado"));
  next();
});



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

// 6. INICIALIZAÇÃO
const start = async () => {
  try {
    await seedDefaults();
    iniciarVerificacaoPacotesExpirados();

    await app.listen({
      port: env.PORT,
      host: '0.0.0.0'
    });
    console.log("Servidor rodando 🐱‍🏍");
  } catch (err) {
    console.error("Erro ao iniciar o servidor:", err);
    process.exit(1);
  }
};

start();