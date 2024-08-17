"use client";
import RestorantItem from "@/components/RestorantItem";
import { IRestorant } from "@/types";
import { useSupabase } from "@/utils/hooks/useSupabase";
import React, { useEffect, useState } from "react";

export default function RestorantRankPage() {
  const { supabase } = useSupabase();
  const [list, setList] = useState<IRestorant[]>([]);

  const getRestorants = async () => {
    const { data: restorants } = await supabase.from("restorant").select("*");

    if (restorants) {
      const restorantsWithYoutubers = await Promise.all(
        restorants.map(async (restorant) => {
          const { data: menus } = await supabase
            .from("restorant_menu")
            .select("*")
            .in("id", restorant.menus);

          const { data: youtubers } = await supabase
            .from("youtuber")
            .select("*")
            .in("id", restorant.youtubers);
          return { ...restorant, youtubers, menus };
        })
      );
      console.log(restorantsWithYoutubers);
      setList(restorantsWithYoutubers);
    }
  };

  useEffect(() => {
    getRestorants();
  }, []);

  return (
    <div>
      {list.map((el) => {
        return <RestorantItem key={`${el.id}-youtuber-item`} restorant={el} />;
      })}
    </div>
  );
}
