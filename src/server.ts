import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import { Server } from "socket.io";
import { UsersRoutes } from "./http/controllers/users/routes";
import { env } from "./Env";
import cors  from'@fastify/cors'
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import multipart from '@fastify/multipart'
import path from 'path'
import fastifyStatic from '@fastify/static'
import multer from 'fastify-multer'
import { OrderRoutes } from "./http/controllers/orders/routes";
import { InteresseRoutes } from "./http/controllers/interessar/routes";
import { AvaliacaoRoutes } from "./http/controllers/avaliacao/routes";
import { CarteiraRoutes } from "./http/controllers/carteira/routes";
import { packageRoutes } from "./http/controllers/packages/routes";
import { MetricsRoutes } from "./http/controllers/metrics/routes";
import { ProfissionRoutes } from "./http/controllers/profissao/routes";
import { NotificacaoRoutes } from "./http/controllers/notification/routes";
import { FavoritosRoutes } from "./http/controllers/favoritos/routes";
import { iniciarVerificacaoPacotesExpirados } from "./Jobs/verificar-pacotes-expirados";
import { VitrineRoutes } from "./http/controllers/vitrine/routes";
import { categoryRoutes } from "./http/controllers/category/routes";
import { prisma } from "./lib/prisma";
import { main } from "./defaults";




// ... (imports permanecem iguais)

const app = Fastify();
const server = app.server;
// configuração de armazenamento




// Configurações essenciais
app.register(multer.contentParser)
// app.register(multipart);
// app.register(fastifyStatic, {
//   root: path.join(__dirname, "./http/controllers/uploads"),
//   prefix: "/uploads/",
// });local

app.register(fastifyStatic, {
  root: path.join(process.cwd(), 'src', 'http', 'controllers', 'uploads'),
  prefix: '/uploads/',
});

console.log('Diretório com process.cwd():', path.join(process.cwd(), 'src', 'http', 'controllers', 'uploads'));
  
app.addHook('onRequest', (request, reply, done) => {
  if (request.url.startsWith('/uploads/')) {
    const decodedUrl = decodeURIComponent(request.url);
    request.raw.url = decodedUrl;
  }
  done();
});


// Segurança e Autenticação
  app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: { cookieName: 'refreshToken', signed: false },
  sign: { expiresIn: '10m' }
});

app.register(fastifyCookie);

// CORS Aprimorado
app.register(cors, {
  origin: [
    // 'https://quintal.onrender.com',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  exposedHeaders: ['Authorization']
});

// Socket.IO
export const io = new Server(server, {
  cors: {
    origin: [
      // 'https://quintal.onrender.com',
      'http://localhost:5173'
    ],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Rotas
app.register(UsersRoutes);
app.register(OrderRoutes);
app.register(AvaliacaoRoutes);
app.register(FavoritosRoutes)
app.register(InteresseRoutes)
app.register(packageRoutes),
app.register(CarteiraRoutes),
app.register(MetricsRoutes),
app.register(ProfissionRoutes)
app.register(NotificacaoRoutes)
app.register(VitrineRoutes)
app.register(categoryRoutes)


main()
// Socket Events
iniciarVerificacaoPacotesExpirados();
io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  socket.on("register", (userId) => {
    console.log(`🔗 Usuário ${userId} entrou na sala`);
    socket.join(String(userId));
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

// Inicialização
const start = async () => {
  try {
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