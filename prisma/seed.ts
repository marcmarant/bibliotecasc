/**
 * Datos de ejemplo para desarrollo
 * poblar mediante el comando: npx prisma db seed
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.book.create({
    data: {
      id: 1,
      title: 'Crimen y Castigo',
      author: 'Fiódor Dostoyevski',
      publishedAt: 1866,
      genre: 'Novela psicológica',
      publisher: 'Editorial Alma',
      photo: 'https://m.media-amazon.com/images/I/713hTReVysL._AC_UF894,1000_QL80_.jpg',
      location: 'A1',
      observations: 'Una de las obras más influyentes de la literatura rusa.',
    },
  })
}

main().catch(console.error).finally(() => prisma.$disconnect())