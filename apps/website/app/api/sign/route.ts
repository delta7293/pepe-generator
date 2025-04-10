import UnprocessableContentError from '@/errors/UnprocessableContentError';
import handleServerError from '@/utils/handleServerError';
import { db } from 'db';
import jwt from 'jsonwebtoken';
import { sql } from 'kysely';
import { z } from 'zod';
import NotFoundError from '@/errors/NotFoundError';
import { verifyMessage } from 'viem';
import UnauthorizedError from '@/errors/UnauthorizedError';
import ConflictError from '@/errors/ConflictError';

const schema = z.object({
  address: z.string({
    required_error: 'Address is required.',
  }),
  message: z.string({
    required_error: 'Message is required.',
  }),
  signature: z.string({
    required_error: 'Signature is required.',
  }),
});

export async function POST(request: Request) {
  try {
    throw new ConflictError('Spinning is over.');

    // const body = await request.json();
    // const result = schema.safeParse(body);

    // if (!result.success) {
    //   throw new UnprocessableContentError(result.error.errors[0].message);
    // }

    // const { address, message, signature } = result.data;

    // const addressLower = address.toLowerCase();

    // await db
    //   .deleteFrom('preparedMessages')
    //   .where('createdAt', '<', sql`now() - INTERVAL '5 min'`)
    //   .execute();

    // const preparedMessage = await db
    //   .selectFrom('preparedMessages')
    //   .select(['id', 'message'])
    //   .where('address', '=', addressLower)
    //   .where('message', '=', message)
    //   .executeTakeFirst();

    // if (!preparedMessage) {
    //   throw new NotFoundError();
    // }

    // const valid = await verifyMessage({
    //   address: addressLower as `0x${string}`,
    //   message,
    //   signature: signature as `0x${string}`,
    // });

    // if (!valid) {
    //   throw new UnauthorizedError();
    // }

    // const token = jwt.sign(
    //   {
    //     address: addressLower,
    //   },
    //   process.env.JWT_SECRET!,
    //   { expiresIn: '24h' },
    // );

    // return Response.json({
    //   token,
    // });
  } catch (error) {
    return handleServerError(error);
  }
}
