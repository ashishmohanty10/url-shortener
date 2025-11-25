'use server'

import { prisma } from '@/db/prisma'
import { generateRandomString } from '@/lib/utils'
import { checkUrlSafetyAction } from '@/server/check-url-safety-action'
import { faker } from '@faker-js/faker'
import { hashPassword } from 'better-auth/crypto'

async function main() {
  console.log('🌱 Seeding database with safety checks...')

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

  console.log(`✅ Admin user ready: ${adminUser.email}`)

  // Attach credential account
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

  console.log(`🔑 Admin password set`)

  // Generate pretend URLs
  const urlsToCreate = Array.from({ length: 10 }) // 10 demo URLs
  const urls: any[] = []

  console.log('🔍 Checking URLs with AI moderation...')

  for (let i = 0; i < urlsToCreate.length; i++) {
    const originalUrl = faker.internet.url() + '/' + faker.string.uuid()
    const shortUrl = generateRandomString(8)

    // Run Gemini Safety Check
    const safety = await checkUrlSafetyAction(originalUrl)

    console.log(
      `URL #${i + 1}: ${originalUrl}`,
      `→ ${safety.data?.isSafe ? 'SAFE' : 'FLAGGED'} (${safety.data?.category})`
    )

    urls.push({
      originalUrl,
      shortUrl,
      userId: adminUser.id,

      clicks: 0,

      approved: safety.data?.isSafe,
      flagged: !safety.data?.isSafe,
      flagCategory: safety.data?.category,
      flagReason: safety.data?.reason,

      createdAt: faker.date.recent({ days: 20 }),
      updatedAt: new Date(),
      ogTitle: faker.lorem.sentence(),
      ogDescription: faker.lorem.sentences(2),
      ogImage: faker.image.urlPicsumPhotos(),
    })
  }

  const createdUrls = await prisma.url.createManyAndReturn({
    data: urls,
  })

  console.log(`📎 Inserted ${createdUrls.length} URLs`)

  // Create review logs for auditing
  await prisma.urlReviewLog.createMany({
    data: createdUrls.map(url => ({
      urlId: url.id,
      action: url.approved ? 'approved' : 'flagged',
      reviewerId: adminUser.id,
    })),
  })

  console.log(`🧾 Created ${createdUrls.length} review logs`)

  // Generate click records for realism
  console.log(`📊 Generating clicks...`)

  let totalClicks = 0

  for (const url of createdUrls) {
    const clickCount = faker.number.int({ min: 10, max: 300 })
    totalClicks += clickCount

    const clickLogs = Array.from({ length: clickCount }).map(() => {
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
        acceptLanguage: faker.helpers.arrayElement(['en-US', 'en-GB', 'es-ES', 'fr-FR']),
        country: faker.location.country(),
        city: faker.location.city(),
        device: faker.helpers.arrayElement(['desktop', 'mobile', 'tablet']),
        os: faker.helpers.arrayElement(['Windows', 'macOS', 'Linux', 'iOS', 'Android']),
        browser: faker.helpers.arrayElement(['Chrome', 'Firefox', 'Safari', 'Edge']),
        isBot: false,
      }
    })

    await prisma.urlClick.createMany({
      data: clickLogs,
    })

    await prisma.url.update({
      where: { id: url.id },
      data: {
        clicks: clickCount,
      },
    })
  }

  console.log(`📈 Generated ${totalClicks} total clicks`)
  console.log(`🎉 Seed complete`)
  console.log(`📧 Admin email: ${adminEmail}`)
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
