import Chat from "@/components/Chat";
import supabaseInternal from "@/utils/setup/supabaseInternal";
import { Metadata } from "next";

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { name, eid } = searchParams;
  let title = 'ExperAI';
  let description = 'Chat with AI experts on any topic. Upload custom context and share with friends.';
  let experaiImage = 'https://i.ibb.co/QCFwcj6/logo.png';

  if (name && eid) {
    // fetch custom npc data
    const npcDetailsData = await supabaseInternal.from('NPC').select().eq('npcId', eid).single();
    const npcDetails = npcDetailsData.data;
    if (npcDetails) {
      title = npcDetails.name;
      experaiImage = npcDetails.imageUrl;
    }
  }
  return {
    title: title,
    description,
    openGraph: {
      images: [experaiImage
      ]
    }
  }
}

export default function ChatPage() {
  return (
    <div className="">
      <Chat />
    </div>
  )
};
