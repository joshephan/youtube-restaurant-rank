import { useEffect, useState } from "react";
import { useSupabase } from "./useSupabase";
import { useParams } from "next/navigation";
import { IRestaurant } from "@/types";

export const useRestaurantRead = () => {
  const { id } = useParams();
  const { supabase } = useSupabase();
  const [restaurant, setRestaurant] = useState<IRestaurant>({
    id: 0,
    authorId: "",
    name: "",
    locationText: "",
    category: "한식",
    kakaomapUrl: "",
    navermapUrl: "",
    homepageUrl: "",
    latitude: "", // api로 콜백으로 넣어야 하는 부분
    longitube: "", // api로 콜백으로 넣어야 하는 부분
  });

  const getRestaurant = async () => {
    if (!id) {
      return;
    }

    const { data } = await supabase
      .from("restaurant")
      .select(
        `
        *,
        restaurant_menu(*),
        youtuber(*)
      `
      )
      .eq("id", id)
      .single();
    setRestaurant(data);
  };

  useEffect(() => {
    getRestaurant();
  }, [id]);

  return {
    restaurant,
    setRestaurant
  };
};
