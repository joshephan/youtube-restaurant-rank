import { createClient } from "@/utils/supabase/client";
import React from "react";

/**
 * 로그인 페이지입니다.
 * 소셜 로그인만 제공하므로 별도의 input UI는 필요가 없습니다 ^^
 */
export default function LoginPage() {
  const supabase = createClient();

  const googleLogin = () => {
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `/auth/callback`,
      },
    });
  };
  return (
    <div>
      <button
        onClick={(e) => {
          e.preventDefault();
          googleLogin();
        }}
      >
        구글 로그인
      </button>
    </div>
  );
}
