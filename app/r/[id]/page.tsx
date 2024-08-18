"use client";
import Container from "@/components/Container";
import { IRestaurant } from "@/types";
import { commaConverter } from "@/utils/convert";
import { useSupabase } from "@/utils/hooks/useSupabase";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

/**
 * 식당별 페이지입니다
 */
export default function RestaurantPage() {
  const { id } = useParams();
  const { supabase } = useSupabase();
  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);

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

  if (!restaurant) {
    return;
  }

  return (
    <Container>
      <div className="relative w-full mb-5">
        <img
          src={restaurant.heroBannerSrc}
          className="w-full block rounded-2xl"
        />
        <div className="absolute inset-0 rounded-2xl shadow-inner bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>
      <h1 className="text-3xl font-bold">{restaurant.name}</h1>
      <h3 className="text-lg text-gray-600">
        도로명 주소: {restaurant.locationText}
      </h3>
      <hr className="my-5" />
      <h2 className="text-2xl font-bold mb-5">대표 메뉴</h2>
      <div className="grid grid-cols-3 gap-3">
        {restaurant.restaurant_menu &&
          restaurant.restaurant_menu.map((el) => {
            return (
              <div key={`menu-${el.id}`} className="">
                <Image
                  src={el.imageSrc!}
                  width={300}
                  height={300}
                  className="object-cover rounded-lg block"
                  alt={el.name}
                />
                <div className="flex flex-col py-2 gap-1">
                  <div className="text-lg font-bold">{el.name}</div>
                  <div className="text-sm">{el.description}</div>
                  <div className="text-sm text-rose-700 font-medium">
                    {commaConverter(el.price)}원
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </Container>
  );
}
