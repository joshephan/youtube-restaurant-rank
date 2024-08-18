"use client";
import Container from "@/components/Container";
import { IRestaurant } from "@/types";
import { commaConverter } from "@/utils/convert";
import { useSupabase } from "@/hooks/useSupabase";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { useRestaurantRead } from "@/hooks/useRestaurantRead";
import { IconEdit } from "@tabler/icons-react";
import Link from "next/link";
import { useUser } from "@/store";

/**
 * 식당별 페이지입니다
 */
function RestaurantContent() {
  const { id } = useParams();
  const { email } = useUser();
  const { restaurant } = useRestaurantRead();

  if (!restaurant) {
    return;
  }

  return (
    <Container>
      <div className="relative w-full mb-5">
        <img
          src={restaurant.heroBannerSrc}
          className="w-full block rounded-2xl max-h-96 object-cover"
        />
        <div className="absolute inset-0 rounded-2xl shadow-inner bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>
      <section className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{restaurant.name}</h1>
          <h3 className="text-lg text-gray-600">
            도로명 주소: {restaurant.locationText}
          </h3>
        </div>
        {email && (
          <Link
            href={`/update/${id}`}
            className="flex gap-1 items-center text-xs px-3 py-2 rounded-2xl text-white bg-gray-400 hover:bg-gray-700"
          >
            <IconEdit size={14} />
            <span>수정</span>
          </Link>
        )}
      </section>

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

export default function RestaurantPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RestaurantContent />
    </Suspense>
  );
}
