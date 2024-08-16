import { TYoutuber } from "@/types";
import { commaConverter } from "@/utils/convert";
import Image from "next/image";
import Link from "next/link";
import React from "react";

/**
 * 유튜버 목록만 따로 볼 때 사용되는 아이템
 */
function YoutuberItem({ youtuber }: { youtuber: TYoutuber }) {
  return (
    <article className="flex gap-2 items-center">
      <Image
        src={youtuber.profileImage}
        width={100}
        height={100}
        alt={youtuber.channelName}
      />
      <div>
        <div>{youtuber.channelName}</div>
        <div>구독자: {commaConverter(youtuber.subscriber)}명</div>
        <Link href={youtuber.channelUrl} target="_blank">
          {youtuber.channelUrl}
        </Link>
      </div>
    </article>
  );
}

const MemorizedYoutuberItem = React.memo(YoutuberItem);

export default MemorizedYoutuberItem;
