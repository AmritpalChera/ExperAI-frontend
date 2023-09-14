"use client";
import { baseurl } from "@/utils/app";
import supabase from "@/utils/setup/supabase";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Explore() {

  const [groups, setGroups] = useState<any>([]);
  const router = useRouter();

  const getGroups = async () => {
    const groupsData = await supabase.from('Group').select('creatorId, imageUrl, name, npcId (npcId, tags, name)').eq('isOriginal', true);
    console.log('groupsData is: ', groupsData);
    if (groupsData.data) setGroups(groupsData.data);
  };

  useEffect(() => {
    getGroups();
  }, []);

  const RenderGroupCard = (group: any, index: number) => {

    const handleCardClick = () => {
      window.location.href = (`${baseurl}/chat?name=${group.name}&eid=${group?.npcId?.npcId}&cid=${group.creatorId}`);
    }

    return (
      <div onClick={handleCardClick} className="flex flex-col md:w-64 rounded-lg border overflow-hidden hover:shadow cursor-pointer" key={index}>
        <div className="h-54 overflow-hidden object-cover">
          <img src={group.imageUrl} alt={group.name} className="h-48 object-cover"  width={512} height={512}/>
        </div>
        
        <div className="flex flex-col items-center p-4">
          <h1 className="text-primary font-bold text-xl">{group.name}</h1>
          <div className="flex w-full max-w-3xl overflow-hidden flex-wrap mt-4">
            {group?.npcId?.tags?.map((tag: string) => <div key={tag} className="px-2 mb-2 rounded-full text-sm bg-green-200">{tag}</div>)}
          </div>
        </div>
      </div>
    )
  };

  return (
    <main className="lg:pl-72">
      <div className="">
        <div className="px-4 py-12  sm:px-6 lg:px-8 flex flex-col justify-center items-center">
          <h1 className="text-4xl font-bold text-primary">Public Experts</h1>
          <h2 className="mt-4 text-gray-500">Explore experts generated by others</h2>
        </div>
        <div className="flex flex-wrap gap-4 p-4">
          {groups.map((group: any, index: number) => RenderGroupCard(group, index))}
        </div>
      </div>
    </main>
  )
}