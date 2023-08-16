
import { NextResponse } from 'next/server'
import { object, string } from 'zod';
import Mindplug from 'mindplug';
import supabase from '@/utils/setup/supabase';
import { createHash } from 'crypto';
import callChatGpt from '@/utils/openai/responder';

const mindplug = new Mindplug({ mindplugKey: process.env.MINDPLUG_KEY! });


export async function POST(req: Request) {
  let { urlHash, search } = await req.json();
  console.log('urlHash is: ', urlHash)
  try {
    const storedUrl = await supabase.from('webVectors').select('uploadId').eq('urlHash', urlHash).single();
    if (storedUrl.error) console.log(storedUrl.error)
    const storedUploadId = storedUrl?.data?.uploadId;
    let context;
    console.log('stored upload id is: ', storedUploadId)
    if (storedUploadId) {
      
      context = await mindplug.query({ metadataFilters: { "genre" : { "$eq": storedUploadId}} , db: 'webpages', collection: 'initial', search, count: 1 });
    }
    context = context?.data && context?.data[0];
    let answer: any;
    if (context) {
      answer = await callChatGpt({ search, context: context?.metadata?.content });
    }
    if (!answer) answer = "Could not find relavent text, please search again"
    return NextResponse.json({answer: answer, confidence: context?.score});
  } catch (e) {
    console.log('error searching content: ', e);
    return NextResponse.json({ error: 'Could not search content' }, { status: 500 });
  }  
}
