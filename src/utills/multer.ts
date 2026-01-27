import multer from 'multer'
import path from 'path'
import fs from 'fs'

// FORÇAR CAMINHO ABSOLUTO NA VPS
// Isso garante que não importa onde o código rode, ele salvará na pasta correta
// const uploadDir = '/root/api_liberal/uploads';

// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true })
//   console.log('📁 Diretório de uploads criado:', uploadDir);
// }



// 1. ISSO VAI GARANTIR QUE SEJA NA PASTA DO PROJETO
const uploadDir = path.resolve(process.cwd(), 'uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 2. USE A VARIÁVEL DINÂMICA AQUI!
    cb(null, uploadDir); 
  },
  filename: (req, file, cb) => {
    const uniqueName = `trem-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});


export const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },

  
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas'));
    }
  }
})