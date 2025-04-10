import UnprocessableContentError from '@/errors/UnprocessableContentError';
import handleServerError from '@/utils/handleServerError';
import { db } from 'db';
import { nanoid } from 'nanoid';
import { sql } from 'kysely';
import { z } from 'zod';
import { createPreparedMessagesTable } from 'db/dist/tables/PreparedMessagesTable';
import ConflictError from '@/errors/ConflictError';

const schema = z.object({
  address: z.string({
    required_error: 'Address is required.',
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

    // const { address } = result.data;

    // const addressLower = address.toLowerCase();

    // await db
    //   .deleteFrom('preparedMessages')
    //   .where('createdAt', '<', sql`now() - INTERVAL '5 min'`)
    //   .execute();

    // const message = `Sign this message to confirm your wallet ownership.\n\nVerification Code: ${nanoid()}`;

    // await db
    //   .insertInto('preparedMessages')
    //   .values({
    //     address: addressLower,
    //     message,
    //   })
    //   .execute();

    // return Response.json({
    //   message,
    // });
  } catch (error) {
    return handleServerError(error);
  }
}
