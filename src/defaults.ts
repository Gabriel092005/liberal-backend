import { prisma } from "@/lib/prisma";

export async function main() {




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