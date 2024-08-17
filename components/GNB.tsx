import { useUser } from "@/store";
import { IconPizza, IconSearch } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

/**
 * 화면 상단에 항상 노출되는 글로벌 네비게이션 바입니다
 * 로그인 상태 > 프로필 버튼
 * 비로그인 상태 > 로그인 버튼
 */
export default function GNB() {
  const { id, avatar_url, name } = useUser();
  const router = useRouter();
  return (
    <nav className="flex justify-between border-b p-5 items-center">
      <Link href="/" className="bg-red-500 text-white w-14 h-14 justify-center rounded-full font-bold flex flex-col items-center">
        <IconPizza size={24} />
        <span className="text-sm">YRR</span>
      </Link>
      <div className="flex items-center border rounded-full pl-3 py-1 w-full max-w-sm">
        <IconSearch size={20} className="text-gray-400" />
        <input
          type="text"
          placeholder="검색어 입력..."
          autoComplete="off"
          className="px-2 py-1 focus:outline-none focus:border-blue-500"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              const inputValue = e.currentTarget.value.trim();
              if (inputValue) {
                router.push(`/q?keyword=${encodeURIComponent(inputValue)}`);
              }
            }
          }}
        />
      </div>
      <div className="flex gap-7 items-center text-gray-800 font-semibold">
        <Link href="/rank">랭킹</Link>
        <Link href="/youtuber">유튜버</Link>
        {id ? (
          <Link href="/profile" className="text-blue-500">
            <Image
              src={avatar_url}
              width={48}
              height={48}
              className="rounded-full shadow-sm border"
              alt={name}
            />
          </Link>
        ) : (
          <Link href="/login" className="text-blue-500">
            로그인
          </Link>
        )}
      </div>
    </nav>
  );
}
