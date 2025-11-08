import { prisma } from '@/lib/prisma'
import { generateRandomString } from '@/lib/utils'
import { faker } from '@faker-js/faker'

async function main() {
  console.log('🌱 Seeding database with 40 URLs...')
  const userId = process.env.USER_ID!

  if (!userId) {
    return 'No user id'
  }

  const urls = Array.from({ length: 40 }).map(() => {
    const originalUrl = faker.internet.url() + '/' + faker.string.uuid() // guarantees uniqueness
    const shortUrl = generateRandomString(8)

    return {
      originalUrl,
      shortUrl,
      clicks: faker.number.int({ min: 0, max: 500 }),
      userId,
      ogTitle: faker.lorem.sentence(),
      ogDescription: faker.lorem.sentences(2),
      ogImage: faker.image.urlPicsumPhotos(),
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
