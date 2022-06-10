import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'


// POST /api/post
// Required fields in body: title, authorEmail
// Optional fields in body: content
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { title, content, authorEmail, authorName } = req.body
  const result = await prisma.post.create({
    data: {
      title: title,
      content: content,
      author: {
        connectOrCreate: {
          where: {
            email: authorEmail,
          },
          create: {
            email: authorEmail,
            name: authorName,
          },
        },
      },
    },
  })
  res.json(result)
}
