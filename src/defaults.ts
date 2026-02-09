import { prisma } from "@/lib/prisma";


export async function main() {



  // ... (seu código de categorias e profissões aqui)

  // 1. Criar Usuário Admin Padrão
  const id = 1000;
  const passwordHash = ("Admin123!");

  const adminExists = await prisma.usuario.findFirst({
    where: { id : id },
  });

  if (!adminExists) {
    await prisma.usuario.create({
      data: {
        nome: "Administrador Geral",
        palavraPasse: passwordHash,
        celular: "999999999",
        nif: "000000000",
        role: "ADMIN", // Ou isAdmin: true, dependendo do seu schema
        municipio:'iana',
        profissao:'iana',
        provincia:'iana',

      },
    });
    console.log("Usuário Admin criado com sucesso!");
  } else {
    console.log("Usuário Admin já existe.");
  }

  console.log("Seed finalizado com sucesso!");





  const categoryDefault = [
    { titulo: "Geral", categoryId: 1 },
  ];

  for (const p of categoryDefault) {
    // Verifica se já existe para não duplicar
    const exists = await prisma.category.findFirst({
      where: { titulo: p.titulo },
    });
    if (!exists) {
      await prisma.category.create({
        data: {
          titulo: p.titulo,
        },
      });
    }
  }
  const profissoesDefault = [
    { titulo: "Engenheiro", categoryId: 1 },
    { titulo: "Médico", categoryId: 1 },
    { titulo: "Professor", categoryId: 1 },
    { titulo: "Advogado", categoryId: 1 },
    { titulo: "Outro", categoryId: 1 },
  ];

  for (const p of profissoesDefault) {
    // Verifica se já existe para não duplicar
    const exists = await prisma.profissao.findFirst({
      where: { titulo: p.titulo },
    });
    if (!exists) {
      await prisma.profissao.create({
        data: {
          titulo: p.titulo,
          category: {
            connect: { id: p.categoryId },
          },
        },
      });
    }
  }

    


  console.log("Profissões default criadas/atualizadas com sucesso!");
}