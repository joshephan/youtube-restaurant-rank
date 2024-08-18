"use client";
import RestaurantItem from "@/components/RestaurantItem";
import { IRestaurant } from "@/types";
import { useSupabase } from "@/utils/hooks/useSupabase";
import React, { useEffect, useState } from "react";

export default function RestaurantRankPage() {
  const { supabase } = useSupabase();
  const [list, setList] = useState<IRestaurant[]>([]);

  const getRestaurants = async () => {
    const { data: restaurants } = await supabase.from("restaurant").select("*");

    if (restaurants) {
      const restaurantsWithYoutubers = await Promise.all(
        restaurants.map(async (restaurant) => {
          const { data: menus } = await supabase
            .from("restaurant_menu")
            .select("*")
            .in("id", restaurant.menus);

          const { data: youtubers } = await supabase
            .from("youtuber")
            .select("*")
            .in("id", restaurant.youtubers);
          return { ...restaurant, youtubers, menus };
        })
      );
      console.log(restaurantsWithYoutubers);
      setList(restaurantsWithYoutubers);
    }
  };

  useEffect(() => {
    getRestaurants();
  }, []);

  return (
    <div>
      {list.map((el) => {
        return <RestaurantItem key={`${el.id}-youtuber-item`} restaurant={el} />;
      })}
    </div>
  );
}
