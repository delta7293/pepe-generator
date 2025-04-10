import { db, init } from 'db';
import fs from 'fs/promises';
import path from 'path';

init();

const TRAITS_DIR = path.join(process.cwd(), 'public', 'images', 'traits');
const BASE_URL = 'http://localhost:3000/images/traits';

async function seedTraits() {
  const folders = await fs.readdir(TRAITS_DIR);

  for (const folder of folders) {
    const folderPath = path.join(TRAITS_DIR, folder);
    const files = await fs.readdir(folderPath);

    // Insert trait
    const [trait] = await db
      .insertInto('traits')
      .values({ name: folder, folder })
      .returningAll()
      .execute();

    // Insert options
    for (const file of files) {
      const name = file.replace(/\.[^/.]+$/, ''); // remove extension
      const fileUrl = `${BASE_URL}/${folder}/${file}`;

      await db.insertInto('traitOptions').values({
        file,
        name,
        traitId: trait.id,
        // imageUrl: fileUrl, // optional
      }).execute();
    }
  }

  console.log('Traits and options seeded!');
}

seedTraits().catch(console.error);
