import { createPublicClient, http, parseAbiItem } from 'viem';

import getChain from '../utils/getChain';
import { existsSync, readFileSync, writeFileSync } from 'fs';

function replaceBigIntWithNumber(obj: any): any {
  if (typeof obj === 'bigint') {
    return Number(obj);
  } else if (typeof obj === 'object' && obj !== null) {
    if (Array.isArray(obj)) {
      return obj.map((item) => replaceBigIntWithNumber(item));
    } else {
      const newObj: { [key: string]: any } = {};
      for (const key in obj) {
        newObj[key] = replaceBigIntWithNumber(obj[key]);
      }
      return newObj;
    }
  } else {
    return obj;
  }
}

async function stats() {}

stats();
