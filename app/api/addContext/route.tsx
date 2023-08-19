
import { NextResponse } from 'next/server'
import { object, string } from 'zod';
import Mindplug from 'mindplug';
import supabase from '@/utils/setup/supabaseInternal';
import { createHash } from 'crypto';
import callChatGpt from '@/utils/openai/responder';




export async function POST(req: Request) {
  let { npcId, userId } = await req.json();
  try {
    let answer = await callChatGpt({ search, chatHistory });
    if (!answer) answer = "Could not find relavent text, please search again";

    const searchWithContext = search + (chatHistory ? chatHistory.slice(-1)[0].content : '');


    return NextResponse.json({answer: answer });
  } catch (e) {
    console.log('error searching content: ', e);
    return NextResponse.json({ error: 'Could not search content' }, { status: 500 });
  }  
}
