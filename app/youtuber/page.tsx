"use client";
import Container from "@/components/Container";
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

  return (
    <Container>
      <h1 className="font-bold text-2xl mb-5">등록된 맛잘알 유튜버</h1>
      <div className="flex flex-wrap gap-2">
        {list.map((el) => {
          return <YoutuberItem key={`${el.id}-youtuber-item`} youtuber={el} />;
        })}
      </div>
    </Container>
  );
}
