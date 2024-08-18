"use client";
import Container from "@/components/Container";
import { useUser } from "@/store";
import { useSupabase } from "@/hooks/useSupabase";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { IconEdit, IconLogout } from "@tabler/icons-react";

/**
 * [Auth Protected] 프로필 정보입니다
 * @author Claude 3.5 sonnet & 아주 조금은 인간이 함 ㅠ
 * @description
 * 재미있는 이야기: 한 프로그래머가 자신의 프로필 페이지를 만들다가
 * 실수로 모든 사용자의 프로필 사진을 고양이 사진으로 바꿔버렸습니다.
 * 결과적으로 그 웹사이트는 하루 동안 '고양이 소셜 네트워크'가 되었죠.
 * 그래서 우리는 이 페이지를 만들 때 특별히 주의를 기울입니다!
 */
export default function ProfilePage() {
  const { supabase } = useSupabase();
  const { email, load, avatar_url, name, id } = useUser();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(name);

  useEffect(() => {
    if (load && !id) {
      router.push("/");
    }
  }, [load, id, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleUpdateProfile = async () => {
    if (newName.trim() !== name) {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: newName })
        .eq("id", id);

      if (!error) {
        // Update local state or trigger a refresh of user data
        setIsEditing(false);
      }
    }
  };

  if (!id) return null;

  return (
    <Container>
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">프로필</h1>
          <button
            onClick={handleLogout}
            className="flex items-center text-red-600 hover:text-red-800"
          >
            <IconLogout className="mr-2" />
            로그아웃
          </button>
        </div>
        <div className="flex items-center mb-6">
          <Image
            src={avatar_url || "/default-avatar.png"}
            alt="Profile"
            width={100}
            height={100}
            className="rounded-full mr-4"
          />
          <div>
            {isEditing ? (
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="text-xl font-semibold text-gray-800 border-b-2 border-blue-500 focus:outline-none"
              />
            ) : (
              <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
            )}
            <p className="text-gray-600">{email}</p>
          </div>
        </div>
        {isEditing ? (
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
            >
              취소
            </button>
            <button
              onClick={handleUpdateProfile}
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              저장
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <IconEdit className="mr-2" />
            프로필 수정
          </button>
        )}
      </div>
    </Container>
  );
}
