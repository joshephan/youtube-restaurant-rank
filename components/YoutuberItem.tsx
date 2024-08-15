import { TYoutuber } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

/**
 * 유튜버 목록만 따로 볼 때 사용되는 아이템
 */
export default function YoutuberItem(props: TYoutuber) {
  return (
    <Link href={`/y/${props.id}`}>
      <Image
        src={props.profileImage}
        width={100}
        height={100}
        alt={props.channelName}
      />
      <div>{props.channelName}</div>
    </Link>
  );
}
