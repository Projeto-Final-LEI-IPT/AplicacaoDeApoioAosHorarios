import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const passwordInicial = process.env.SEED_ADMIN_PASSWORD || 'Admin123!'
  const password = await bcrypt.hash(passwordInicial, 10)
  
  await prisma.user.create({
    data: {
      nome: 'Administrador',
      email: 'admin@ipt.pt',
      password,
      role: 'ADMIN',
    },
  })
  console.log('Utilizador criado com sucesso')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())