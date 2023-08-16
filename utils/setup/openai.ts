import Bottleneck from 'bottleneck';
import { Configuration, OpenAIApi } from 'openai';


export const limiterOpenai = new Bottleneck({
  maxConcurrent: 1,
  minTime: 50
});


export default function initializeOpenai () {
  const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
  });
  const openai = new OpenAIApi(configuration);
  return openai;
}
