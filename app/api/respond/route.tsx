
import { NextResponse } from 'next/server'
import { object, string } from 'zod';
import Mindplug from 'mindplug';
import supabase from '@/utils/setup/supabase';
import { createHash } from 'crypto';
import callChatGpt from '@/utils/openai/responder';

const mindplug = new Mindplug({ mindplugKey: process.env.MINDPLUG_KEY! });


export async function POST(req: Request) {
  let { search, chatHistory } = await req.json();
  try {
    let answer = await callChatGpt({ search, chatHistory });
    if (!answer) answer = "Could not find relavent text, please search again"
    return NextResponse.json({answer: answer});
  } catch (e) {
    console.log('error searching content: ', e);
    return NextResponse.json({ error: 'Could not search content' }, { status: 500 });
  }  
}
