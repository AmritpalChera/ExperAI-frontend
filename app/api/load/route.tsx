
import { NextResponse } from 'next/server'
import { object, string } from 'zod';
import Mindplug from 'mindplug';
import supabase from '@/utils/setup/supabase';
import { createHash } from 'crypto';

const mindplug = new Mindplug({ mindplugKey: process.env.MINDPLUG_KEY! });


export async function POST(req: Request) {
  let { url } = await req.json();
  if (!url) return NextResponse.json({ error: 'Please provide url' }, { status: 500 });
  // check if url already exists in our db
  url = url.toLowerCase();
  const urlHash = createHash('sha256').update(url).digest('hex');
  // delete all previous data on the url
  try {
    const storedUrl = await supabase.from('webVectors').select('uploadId').eq('urlHash', urlHash).single();
    const storedUploadId = storedUrl?.data?.uploadId;
    if (storedUploadId) {
      await mindplug.deleteByUploadId({ uploadId: storedUploadId, db: 'webpages', collection: 'initial' });
    }
    // insert in new data
    const plugReponse = await mindplug.storeWeb({ url, db: 'webpages', collection: 'initial', metadata: {urlHash} });
    const data = plugReponse?.data;
    if (data?.success) {
      await supabase.from('webVectors').upsert({url, urlHash, uploadId: data.uploadId})
    }
    return NextResponse.json({ urlHash, numberVectors: data?.vectors?.length || 0 });
  } catch (e) {
    console.log('error storing content: ', e);
    return NextResponse.json({ error: 'Could not store content' }, { status: 500 });
  }  
}


// export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
//   if (req.method === 'POST') {
//     // upload url embeddings
//     const data = await mindplug.storeWeb({ url: req.body.url, db: 'webpages', collection: 'initial' });
//     console.log('data is: ', data);
//     res.json(data)
//   } else {
//     res.status(400).json({ error: 'Invalid request' });
//   }
// }
