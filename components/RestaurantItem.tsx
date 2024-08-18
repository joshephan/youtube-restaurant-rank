import { IRestaurant } from "@/types";
import { commaConverter } from "@/utils/convert";
import Image from "next/image";
import Link from "next/link";
import React from "react";

/**
 * 식당 각각의 아이템
 * 클릭시 해당 식당 페이지로 이동합니다
 * @returns
 */
export default function RestaurantItem({
  restaurant,
}: {
  restaurant: IRestaurant;
}) {
  const { id, name, restaurant_menu } = restaurant;
  return (
    <section key={`${id}-item`} className="p-4">
      <div className="flex items-center gap-2">
        <Link href={`/r/${id}`} className="text-xl font-bold">
          {name}
        </Link>
      </div>
      <Link className="flex gap-1 py-3" href={`/r/${id}`}>
        {restaurant_menu &&
          restaurant_menu.map((el) => {
            return (
              <article key={`menu-${el.id}`}>
                <Image
                  src={el.imageSrc!}
                  width={300}
                  height={300}
                  className="block object-cover rounded-lg"
                  alt={el.name}
                />
                <div className="flex items-center justify-between py-2">
                  <span className="text-lg font-bold">{el.name}</span>
                  <span className="text-sm font-medium text-rose-700">
                    {commaConverter(el.price)}원
                  </span>
                </div>
              </article>
            );
          })}
      </Link>
    </section>
  );
}
