"use client";
import { useUser } from "@/store";
import { useSupabase } from "@/utils/hooks/useSupabase";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

/**
 * [Auth Protected] 프로필 정보입니다
 */
export default function ProfilePage() {
  const { supabase } = useSupabase();
  const { email, load } = useUser();
  const router = useRouter();

  useEffect(() => {
    // 현재 비로그인 사용자
    if (load && email === "") {
      router.push("/");
    }
  }, [load]);

  return (
    <div>
      <h1>프로필</h1>
      <div>이메일: {email}</div>
      <button
        onClick={async (e) => {
          e.preventDefault();
          await supabase.auth.signOut();
        }}
      >
        로그아웃
      </button>
    </div>
  );
}
