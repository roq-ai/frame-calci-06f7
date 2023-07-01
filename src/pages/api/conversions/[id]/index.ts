import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { conversionValidationSchema } from 'validationSchema/conversions';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.conversion
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getConversionById();
    case 'PUT':
      return updateConversionById();
    case 'DELETE':
      return deleteConversionById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getConversionById() {
    const data = await prisma.conversion.findFirst(convertQueryToPrismaUtil(req.query, 'conversion'));
    return res.status(200).json(data);
  }

  async function updateConversionById() {
    await conversionValidationSchema.validate(req.body);
    const data = await prisma.conversion.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteConversionById() {
    const data = await prisma.conversion.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
