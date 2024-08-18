"use client";
import Container from "@/components/Container";
import RestaurantItem from "@/components/RestaurantItem";
import { IRestaurant } from "@/types";
import { useSupabase } from "@/hooks/useSupabase";
import React, { useEffect, useState } from "react";

export default function RestaurantRankPage() {
  const { supabase } = useSupabase();
  const [list, setList] = useState<IRestaurant[]>([]);

  const getRestaurants = async () => {
    const { data: restaurants } = await supabase.from("restaurant").select(`*,
      restaurant_menu(*),
      youtuber(*)
      `);

    if (restaurants) {
      setList(restaurants);
    }
  };

  useEffect(() => {
    getRestaurants();
  }, []);

  return (
    <Container>
      {list.map((el) => {
        return (
          <RestaurantItem key={`${el.id}-youtuber-item`} restaurant={el} />
        );
      })}
    </Container>
  );
}
