"use client";
import YoutuberItem from "@/components/YoutuberItem";
import { TYoutuber } from "@/types";
import { useSupabase } from "@/utils/hooks/useSupabase";
import React, { useEffect, useState } from "react";

export default function YoutubersPage() {
  const { supabase } = useSupabase();
  const [list, setList] = useState<TYoutuber[]>([]);

  const getYoutubers = async () => {
    const { data: youtuber } = await supabase.from("youtuber").select();
    console.log(youtuber);
    if (youtuber) {
      setList(youtuber);
    }
  };

  useEffect(() => {
    getYoutubers();
  }, []);

  console.log("youtuber: ", list);
  return (
    <div>
      {list.map((el) => {
        return <YoutuberItem key={`${el.id}-youtuber-item`} youtuber={el} />;
      })}
    </div>
  );
}
