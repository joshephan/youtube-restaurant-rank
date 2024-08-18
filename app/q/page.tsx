"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSupabase } from "@/utils/hooks/useSupabase";
import Container from "@/components/Container";
import RestaurantItem from "@/components/RestaurantItem";
import YoutuberItem from "@/components/YoutuberItem";
import { IRestaurant, TYoutuber } from "@/types";

function SearchContent() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const { supabase } = useSupabase();
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
  const [youtubers, setYoutubers] = useState<TYoutuber[]>([]);
  const [menus, setMenus] = useState<any[]>([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (keyword) {
        // Search restaurants
        const { data: restaurantData } = await supabase
          .from("restaurant")
          .select("*")
          .ilike("name", `%${keyword}%`);

        // Search youtubers
        const { data: youtuberData } = await supabase
          .from("youtuber")
          .select("*")
          .ilike("channelName", `%${keyword}%`);

        // Search menus
        const { data: menuData } = await supabase
          .from("restaurant_menu")
          .select("*, restaurant:restaurant(*)")
          .ilike("name", `%${keyword}%`);

        setRestaurants(restaurantData || []);
        setYoutubers(youtuberData || []);
        setMenus(menuData || []);
      }
    };

    fetchSearchResults();
  }, [keyword, supabase]);

  return (
    <Container>
      <h1 className="mb-4 text-2xl font-bold">키워드 검색 결과: "{keyword}"</h1>
      {restaurants.length > 0 && (
        <section>
          <h2 className="mb-2 text-xl font-semibold">Restaurants</h2>
          {restaurants.map((restaurant) => (
            <RestaurantItem key={restaurant.id} restaurant={restaurant} />
          ))}
        </section>
      )}

      {youtubers.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-2 text-xl font-semibold">Youtubers</h2>
          <div className="flex flex-wrap gap-4">
            {youtubers.map((youtuber) => (
              <YoutuberItem key={youtuber.id} youtuber={youtuber} />
            ))}
          </div>
        </section>
      )}

      {menus.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-2 text-xl font-semibold">Menus</h2>
          <ul>
            {menus.map((menu) => (
              <li key={menu.id} className="mb-2">
                <p className="font-medium">{menu.name}</p>
                <p className="text-sm text-gray-600">
                  Restaurant: {menu.restaurant.name}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {restaurants.length === 0 &&
        youtubers.length === 0 &&
        menus.length === 0 && <p>No results found for "{keyword}"</p>}
    </Container>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}