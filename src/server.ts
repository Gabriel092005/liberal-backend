import Fastify from "fastify";
import { Server, Socket } from "socket.io";
import cors from '@fastify/cors';
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import path from 'path';

// Importação das Configurações e Rotas

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

import fs from 'node:fs';
import multer from "multer";
import { env } from "./Env";
import { Pagamentos } from "./http/controllers/payments/routes";
import { expirationService } from "./http/controllers/payments/expirationService";


const app = Fastify({
  logger: false, 
});
const isProduction = process.platform === 'linux';

const __dirname = process.cwd(); 


// Define a pasta de uploads na raiz do projeto
const uploadDir = path.resolve(__dirname, 'uploads');


const UPLOAD_PATH = isProduction
  ? '/root/api_liberal/uploads' // Caminho fixo da sua VPS
  : path.resolve(process.cwd(), 'uploads'); // Caminho local no seu Windows

if (!fs.existsSync(UPLOAD_PATH)) {
  fs.mkdirSync(UPLOAD_PATH, { recursive: true });
  console.log('📁 [SISTEMA] Pasta de uploads criada em:', UPLOAD_PATH);
} else {
  console.log('✅ [SISTEMA] Pasta de uploads detectada em:', UPLOAD_PATH);
}

// --- 2. CONFIGURAÇÃO DO MULTER ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(`📥 [MULTER] Recebendo arquivo: ${file.originalname}`);
    cb(null, UPLOAD_PATH); // Salva na pasta correta que o static lê
  },
  filename: (req, file, cb) => {
    const uniqueName = `trem-${Date.now()}-${path.extname(file.originalname)}`;
    console.log(`💾 [MULTER] Salvando como: ${uniqueName}`);
    cb(null, uniqueName);
  }
});

export const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } 
});

// --- 3. REGISTRO DE PLUGINS ---

// IMPORTANTE: Parser para não dar erro 415
app.addContentTypeParser('multipart/form-data', (request, payload, done) => {
  done(null);
});

// No registro do Fastify Static:
app.register(fastifyStatic, {
  root: uploadDir,
  prefix: '/uploads/',
});


// Registro do Static
// app.register(fastifyStatic, {
  //   root: UPLOAD_PATH,
//   prefix: '/uploads/',
//   decorateReply: true 
// });

// --- 4. LOGS DE DIAGNÓSTICO (HOOKS) ---

// Log para cada vez que alguém tentar ACESSAR uma imagem
app.addHook('onRequest', (request, reply, done) => {
  if (request.url.startsWith('/uploads/')) {
    const filePath = path.join(UPLOAD_PATH, request.url.replace('/uploads/', ''));
    const exists = fs.existsSync(filePath);
    console.log(`🔍 [STATIC] Pedido de imagem: ${request.url}`);
    console.log(`📂 [STATIC] Tentando ler em: ${filePath} | Existe? ${exists ? 'SIM' : 'NÃO'}`);
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
let io: Server;

// ... resto do seu código (plugins, rotas, etc)

const start = async () => {
  try {
    await seedDefaults();
    // iniciarVerificacaoPacotesExpirados();



    // 2. AGUARDE o Fastify inicializar o servidor interno
    await app.ready();
    
    // 3. AGORA você vincula o Socket.io ao app.server
    io = new Server(app.server, {
      path: "/api/socket.io/", 
      transports: ['polling', 'websocket'], // Polling ajuda a evitar o erro 400 inicial
      cors: {
        origin: ['http://localhost:5173', 'https://liberalconnect.org'],
        credentials: true,
      },
      pingTimeout: 30000,
      pingInterval: 10000,
    });
    

    io.on("connection", (socket) => {
      // O Insomnia envia parâmetros via handshake.query
      const { userId } = socket.handshake.query;

    
      if (userId) {
        const room = String(userId);
        socket.join(room);

        socket.on("join_room", (userId) => {
          if (userId) {
          socket.join(String(userId));
            console.log(`Usuário ${userId} está online na sala privada.`);
          }
        });
        
        console.log(`🔌 [Socket] Novo cliente conectado: ${socket.id}`);
        console.log(`🏠 [Socket] Cliente inserido na sala: ${room}`);
    
        // LOG CRUCIAL: Verifique se isso aparece no seu terminal
        const members = io.sockets.adapter.rooms.get(room)?.size || 0;
        console.log(`👥 [Debug] Pessoas na sala ${room} agora: ${members}`);
      } else {
        console.log("⚠️ [Socket] Cliente conectado sem userId na Query String");
      }
    
      socket.on("disconnect", () => {
        console.log("❌ [Socket] Cliente desconectado");
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
export { io, app };

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
app.register(Pagamentos)

app.post("/admin/debug/forcar-expiracao", async (req, res) => {
  await expirationService["runCheck"]();
  return res.send({ ok: true, mensagem: "ExpirationService executado!" });
});


app.addHook("onReady", async () => {
  expirationService.start();
});

app.addHook("onClose", async () => {
  expirationService.stop();
})



start();