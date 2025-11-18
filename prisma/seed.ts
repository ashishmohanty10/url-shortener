import { prisma } from '@/lib/prisma'
import { generateRandomString } from '@/lib/utils'
import { faker } from '@faker-js/faker'
import { hashPassword } from 'better-auth/crypto'

async function main() {
  console.log('🌱 Seeding database...')

  // Hash the admin password
  const adminEmail = process.env.ADMIN_EMAIL!
  const adminPassword = process.env.ADMIN_PASSWORD!
  const hashedPassword = await hashPassword(adminPassword)

  // Create or update admin user
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      emailVerified: true,
      role: 'admin',
    },
    create: {
      email: adminEmail,
      name: 'Admin User',
      emailVerified: true,
      role: 'admin',
      image: faker.image.avatar(),
    },
  })

  console.log(`✅ Created/Updated admin user: ${adminUser.email}`)

  // Create or update the account with password
  await prisma.account.upsert({
    where: {
      id: `${adminUser.id}-credential`,
    },
    update: {
      password: hashedPassword,
    },
    create: {
      id: `${adminUser.id}-credential`,
      accountId: adminUser.id,
      providerId: 'credential',
      userId: adminUser.id,
      password: hashedPassword,
    },
  })

  console.log(`✅ Set admin password`)

  // Generate URLs for the admin user
  const urls = Array.from({ length: 40 }).map(() => {
    const originalUrl = faker.internet.url() + '/' + faker.string.uuid()
    const shortUrl = generateRandomString(8)

    return {
      originalUrl,
      shortUrl,
      clicks: 0,
      userId: adminUser.id,
      ogTitle: faker.lorem.sentence(),
      ogDescription: faker.lorem.sentences(2),
      ogImage: faker.image.urlPicsumPhotos(),
      createdAt: faker.date.recent({ days: 30 }),
      updatedAt: new Date(),
    }
  })

  const createdUrls = await prisma.url.createManyAndReturn({
    data: urls,
    skipDuplicates: true,
  })

  console.log(`✅ Created ${createdUrls.length} URLs`)

  // Generate click data for each URL
  const urlClickPromises = createdUrls.map(async url => {
    const numberOfClicks = faker.number.int({ min: 5, max: 500 })

    const clickRecords = Array.from({ length: numberOfClicks }).map(() => {
      const clickDate = faker.date.between({
        from: url.createdAt,
        to: new Date(),
      })

      return {
        urlId: url.id,
        createdAt: clickDate,
        ip: faker.internet.ipv4(),
        referer: faker.internet.url(),
        userAgent: faker.internet.userAgent(),
        acceptLanguage: faker.helpers.arrayElement(['en-US', 'en-GB', 'es-ES', 'fr-FR', 'de-DE']),
        country: faker.location.country(),
        city: faker.location.city(),
        device: faker.helpers.arrayElement(['desktop', 'mobile', 'tablet']),
        os: faker.helpers.arrayElement(['Windows', 'macOS', 'Linux', 'iOS', 'Android']),
        browser: faker.helpers.arrayElement(['Chrome', 'Firefox', 'Safari', 'Edge']),
        isBot: false,
      }
    })

    await prisma.urlClick.createMany({
      data: clickRecords,
      skipDuplicates: true,
    })

    await prisma.url.update({
      where: { id: url.id },
      data: { clicks: numberOfClicks },
    })

    return numberOfClicks
  })

  const clickCounts = await Promise.all(urlClickPromises)
  const totalClicks = clickCounts.reduce((sum, count) => sum + count, 0)

  console.log(`✅ Created ${totalClicks} UrlClick records`)
  console.log('🎉 Seed complete! Admin user and data created successfully!')
  console.log(`📧 Admin email: ${adminUser.email}`)
  console.log(`🔑 Admin password: ${adminPassword}`)
  console.log(`🆔 Admin ID: ${adminUser.id}`)
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
