import { TYoutuber } from "@/types";
import { commaConverter, mergeClassNames } from "@/utils/convert";
import { IconLink } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

/**
 * 유튜버 목록만 따로 볼 때 사용되는 아이템
 */
function YoutuberItem({ youtuber }: { youtuber: TYoutuber }) {
  const router = useRouter();
  const moveToYoutuberPage = () => {
    router.push(`/y/${youtuber.id}`);
  };
  return (
    <article
      className={mergeClassNames(
        "flex flex-col gap-4 items-center p-3 rounded-lg border",
        "w-full max-w-64 cursor-pointer",
        "hover:-translate-y-1 transition-all duration-300",
        "shadow-md hover:shadow-lg"
      )}
      onClick={() => {
        moveToYoutuberPage();
      }}
    >
      <Image
        src={youtuber.profileImage}
        width={80}
        height={80}
        className="rounded-full shadow-lg shrink-0"
        alt={youtuber.channelName}
      />
      <div className="flex justify-between items-center w-full">
        <div>
          <div
            className="text-lg font-medium text-slate-800"
            onClick={() => {
              moveToYoutuberPage();
            }}
          >
            {youtuber.channelName}
          </div>
          <div className="text-sm text-gray-500">
            구독자: {commaConverter(youtuber.subscriber)}명
          </div>
        </div>
        <Link
          href={youtuber.channelUrl}
          target="_blank"
          className="text-rose-400"
        >
          <IconLink />
        </Link>
      </div>
    </article>
  );
}

const MemorizedYoutuberItem = React.memo(YoutuberItem);

export default MemorizedYoutuberItem;
