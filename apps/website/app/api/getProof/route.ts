import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import { z } from 'zod';

import allowlist from '@/data/allowlist.json';
import NotFoundError from '@/errors/NotFoundError';
import UnprocessableContentError from '@/errors/UnprocessableContentError';
import handleServerError from '@/utils/handleServerError';
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

    // const values = [...new Set(allowlist.map((a) => a.toLowerCase()))];
    // const addressIndex = values.findIndex((value) => value === addressLower);

    // if (addressIndex === -1) {
    //   throw new NotFoundError();
    // }

    // const leafNodes = values.map((addr) => keccak256(addr));
    // const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
    // const root = merkleTree.getHexRoot();

    // const claimingAddress = leafNodes[addressIndex];
    // const proof = merkleTree.getHexProof(claimingAddress);

    // return Response.json({
    //   proof,
    //   root,
    // });
  } catch (error) {
    return handleServerError(error);
  }
}
