
import { NextResponse } from 'next/server'
import { createHash } from 'crypto';
import callChatGpt from '@/utils/openai/responder';
import getTool, { handleTools } from './tools';
import mindplug from '@/utils/setup/mindplug';
import supabase from '@/utils/setup/supabaseInternal';

const storeMessage = async ({ senderUserId, userId, text, npcId, role }: any) => {
  const storedData = await supabase.from('exp-messages').upsert({ senderUserId, userId, content: text, npcId, role });
  if (storedData.error) console.log(storedData.error);
}

const getContextSearch = async ({chatHistory, search}: any) => {
  const prevMessage = search + (chatHistory ? chatHistory.slice(-1)[0].content : '');
  const template = `
    You are a researching assistant that combines given input from the user to a searchable query for embeddings search.
  `;
  const toSearch = `
    Could you combine these into a single concise sentence for embeddings search.
    The query provides a user search and its previous context from the assitant

    1. Search: ${search}

    2. Previous assistant response: ${prevMessage}.

    Keep it short and only to search string.
  `;
  const shortContext = await callChatGpt({ search: toSearch, customTemplate: template });
  return shortContext;
}

export async function POST(req: Request) {
  let { search, chatHistory, userId, npcId } = await req.json();
  const searchWithContext = search + (chatHistory ? chatHistory.slice(-1)[0].content : '');
  const shortContext = await getContextSearch({ chatHistory, search });
  try {
    // get context
    let context;
    if (userId && npcId) {
      const urlHash = createHash('sha256').update(`${userId}-${npcId}`).digest('hex');
      context = await mindplug.query({ db: 'experAi-contexts', collection: urlHash, search: shortContext || search, count: 1 }).then((res: any) => res.data);
      context = context && context[0];
      if (context?.score <= 0.75) {
        context = undefined;
      } else if (context) {
        context = {
          metadata: context.metadata,
          score: context.score
        }
      }
    }

    let answer = await callChatGpt({ search, chatHistory, context: context?.metadata?.content });
    if (!answer) answer = "Could not find relavent text, please search again";

    const toolNeeded = await getTool(searchWithContext);
    const toolResponse = await handleTools(toolNeeded, searchWithContext).catch(err => { return {} });
    delete context?.metadata?.content;


    if (userId && npcId) {
      await storeMessage({ text: search, userId, npcId, senderUserId: userId, role: 'user' });
      await storeMessage({ text: answer, npcId, userId, senderUserId: npcId, role: 'assistant' });
    }

    return NextResponse.json({answer: answer, externalData: toolResponse, context });
  } catch (e) {
    console.log('error searching content: ', e);
    return NextResponse.json({ error: 'Could not search content' }, { status: 500 });
  }  
}
