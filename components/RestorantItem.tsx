import { IRestorant } from "@/types";
import { commaConverter } from "@/utils/convert";
import Image from "next/image";
import Link from "next/link";
import React from "react";

/**
 * 식당 각각의 아이템
 * 클릭시 해당 식당 페이지로 이동합니다
 * @returns
 */
export default function RestorantItem({
  restorant,
}: {
  restorant: IRestorant;
}) {
  const { id, name, menus, youtubers } = restorant;
  return (
    <section key={`${id}-item`} className="p-4">
      <div className="flex gap-2 items-center">
        <Link href={`/r/${id}`} className="text-xl font-bold">
          {name}
        </Link>
        <div className="flex gap-1 items-center">
          {youtubers.map((el) => {
            // 식당별 카드 안에서 해당 식당을 추천한 유튜버 목록을 간단하게 표기
            return (
              <Link key={el.id} href={`/y/${el.id}`}>
                <Image
                  src={el.profileImage}
                  width={32}
                  height={32}
                  className="rounded-full"
                  alt={el.channelName}
                />
              </Link>
            );
          })}
        </div>
      </div>
      <Link className="flex gap-1 py-3" href={`/r/${id}`}>
        {menus.map((el) => {
          return (
            <article key={`menu-${el.id}`}>
              <Image
                src={el.imageSrc!}
                width={300}
                height={300}
                className="object-cover rounded-lg block"
                alt={el.name}
              />
              <div className="flex justify-between items-center py-2">
                <span className="text-lg font-bold">{el.name}</span>
                <span className="text-sm text-rose-700 font-medium">
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
