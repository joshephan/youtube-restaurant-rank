"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSupabase } from "@/utils/hooks/useSupabase";
import Container from "@/components/Container";
import RestorantItem from "@/components/RestorantItem";
import YoutuberItem from "@/components/YoutuberItem";
import { IRestorant, TYoutuber } from "@/types";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const { supabase } = useSupabase();
  const [restorants, setRestorants] = useState<IRestorant[]>([]);
  const [youtubers, setYoutubers] = useState<TYoutuber[]>([]);
  const [menus, setMenus] = useState<any[]>([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (keyword) {
        // Search restorants
        const { data: restorantData } = await supabase
          .from("restorant")
          .select("*")
          .ilike("name", `%${keyword}%`);

        // Search youtubers
        const { data: youtuberData } = await supabase
          .from("youtuber")
          .select("*")
          .ilike("channelName", `%${keyword}%`);

        // Search menus
        const { data: menuData } = await supabase
          .from("restorant_menu")
          .select("*, restorant:restorant(*)")
          .ilike("name", `%${keyword}%`);

        setRestorants(restorantData || []);
        setYoutubers(youtuberData || []);
        setMenus(menuData || []);
      }
    };

    fetchSearchResults();
  }, [keyword, supabase]);

  return (
    <Container>
      <h1 className="text-2xl font-bold mb-4">키워드 검색 결과: "{keyword}"</h1>
      {restorants.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-2">Restaurants</h2>
          {restorants.map((restorant) => (
            <RestorantItem key={restorant.id} restorant={restorant} />
          ))}
        </section>
      )}

      {youtubers.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Youtubers</h2>
          <div className="flex flex-wrap gap-4">
            {youtubers.map((youtuber) => (
              <YoutuberItem key={youtuber.id} youtuber={youtuber} />
            ))}
          </div>
        </section>
      )}

      {menus.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Menus</h2>
          <ul>
            {menus.map((menu) => (
              <li key={menu.id} className="mb-2">
                <p className="font-medium">{menu.name}</p>
                <p className="text-sm text-gray-600">
                  Restaurant: {menu.restorant.name}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {restorants.length === 0 &&
        youtubers.length === 0 &&
        menus.length === 0 && <p>No results found for "{keyword}"</p>}
    </Container>
  );
}
