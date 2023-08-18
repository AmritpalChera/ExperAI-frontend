
import { NextResponse } from 'next/server'
import { object, string } from 'zod';
import Mindplug from 'mindplug';
import supabase from '@/utils/setup/supabase';
import { createHash } from 'crypto';
import callChatGpt from '@/utils/openai/responder';
import getTool, { handleTools } from './tools';



export async function POST(req: Request) {
  let { search, chatHistory } = await req.json();
  try {
    let answer = await callChatGpt({ search, chatHistory });
    if (!answer) answer = "Could not find relavent text, please search again";

    const searchWithContext = search + (chatHistory ? chatHistory.slice(-1)[0].content : '');

    const toolNeeded = await getTool(searchWithContext);
    const toolResponse = await handleTools(toolNeeded, searchWithContext).catch(err => { return {} });

    return NextResponse.json({answer: answer, externalData: toolResponse });
  } catch (e) {
    console.log('error searching content: ', e);
    return NextResponse.json({ error: 'Could not search content' }, { status: 500 });
  }  
}
