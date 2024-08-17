import { useSupabase } from "@/utils/hooks/useSupabase";
import { IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

/**
 * 화면 상단에 항상 노출되는 글로벌 네비게이션 바입니다
 * 로그인 상태 > 프로필 버튼
 * 비로그인 상태 > 로그인 버튼
 */
export default function GNB() {
  const { id } = useSupabase();
  const router = useRouter();
  return (
    <nav className="flex justify-between border-b p-5 items-center">
      <Link href="/" className="text-red-500 font-bold">
        이름 제발 정해주세요
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
      <div className="flex gap-5">
        <Link href="/rank">랭킹</Link>
        <Link href="/youtuber">유튜버</Link>
        {id ? (
          <Link href="/profile" className="text-blue-500">
            프로필
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
