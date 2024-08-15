import { IRestorant } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

/**
 * 식당 각각의 아이템
 * 클릭시 해당 식당 페이지로 이동합니다
 * @returns
 */
export default function RestorantItem(props: IRestorant) {
  const { id, name, locationText, youtubers } = props;
  return (
    <Link key={`${id}-item`} href={`/r/${id}`}>
      <div>{name}</div>
      <div>{locationText}</div>
      <div>추천 유튜버 목록</div>
      <ul>
        {youtubers.map((el) => {
          // 식당별 카드 안에서 해당 식당을 추천한 유튜버 목록을 간단하게 표기
          return (
            <li key={el.id}>
              <Image
                src={el.profileImage}
                width={56}
                height={56}
                alt={el.channelName}
              />
              <span>{el.channelName}</span>
              <Link href={`/y/${el.id}`}>자세히 보기</Link>
            </li>
          );
        })}
      </ul>
    </Link>
  );
}
