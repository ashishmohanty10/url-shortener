import { prisma } from '@/lib/prisma'
import { faker } from '@faker-js/faker'

async function main() {
  console.log('🌱 Seeding database with 40 URLs...')

  const userId = 'ms2gYa9tlxpPFGiH4A3gFfxhc0qv5XGx'

  const urls = Array.from({ length: 40 }).map(() => {
    const originalUrl = faker.internet.url()
    const shortUrl = faker.internet.domainWord().slice(0, 6) + '-' + faker.string.alphanumeric(4)

    return {
      originalUrl,
      shortUrl,
      clicks: faker.number.int({ min: 0, max: 500 }),
      userId,
      createdAt: faker.date.recent({ days: 30 }),
      updatedAt: new Date(),
    }
  })

  await prisma.url.createMany({
    data: urls,
    skipDuplicates: true,
  })

  console.log('✅ Seed complete: 40 URLs created!')
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
