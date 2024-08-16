import { useSupabase } from "@/utils/hooks/useSupabase";
import Link from "next/link";
import React from "react";

/**
 * 화면 상단에 항상 노출되는 글로벌 네비게이션 바입니다
 * 로그인 상태 > 프로필 버튼
 * 비로그인 상태 > 로그인 버튼
 */
export default function GNB() {
  const { id } = useSupabase();

  return (
    <nav className="flex justify-between border-b p-5">
      <Link href="/" className="text-red-500">메인</Link>
      {id ? (
        <Link href="/profile" className="text-blue-500">프로필</Link>
      ) : (
        <Link href="/login" className="text-blue-500">로그인</Link>
      )}
    </nav>
  );
}
