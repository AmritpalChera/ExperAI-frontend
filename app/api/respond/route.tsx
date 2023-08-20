
import { NextResponse } from 'next/server'
import { object, string } from 'zod';
import Mindplug from 'mindplug';
import supabase from '@/utils/setup/supabaseInternal';
import { createHash } from 'crypto';
import callChatGpt from '@/utils/openai/responder';
import getTool, { handleTools } from './tools';
import mindplug from '@/utils/setup/mindplug';



export async function POST(req: Request) {
  let { search, chatHistory, userId, npcId } = await req.json();
  try {

    let context;
    if (userId && npcId) {
      const urlHash = createHash('sha256').update(`${userId}-${npcId}`).digest('hex');
      console.log('urlHash is: ', urlHash)
      context = await mindplug.query({ db: 'experAi-contexts', collection: urlHash, search, count: 1 }).then(res => res.data);
      context = context && context[0];
      if (context?.score <= 0.75) {
        context = undefined;
      } else {
        context = {
          metadata: context.metadata,
          score: context.score
        }
      }  
    }
    // console.log('context is: ', context);
    let answer = await callChatGpt({ search, chatHistory, context: context?.metadata?.content });
    if (!answer) answer = "Could not find relavent text, please search again";

    const searchWithContext = search + (chatHistory ? chatHistory.slice(-1)[0].content : '');

    const toolNeeded = await getTool(searchWithContext);
    const toolResponse = await handleTools(toolNeeded, searchWithContext).catch(err => { return {} });

    delete context?.metadata?.content;

    return NextResponse.json({answer: answer, externalData: toolResponse, context });
  } catch (e) {
    console.log('error searching content: ', e);
    return NextResponse.json({ error: 'Could not search content' }, { status: 500 });
  }  
}
