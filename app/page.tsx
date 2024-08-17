"use client";
import { useState, useEffect } from "react";
import Container from "@/components/Container";
import { useSupabase } from "@/utils/hooks/useSupabase";
import Link from "next/link";
import Image from "next/image";
import { IRestorant, TYoutuber } from "@/types";

export default function Home() {
  const { supabase } = useSupabase();
  const [recentRestorants, setRecentRestorants] = useState<IRestorant[]>([]);
  const [youtubers, setYoutubers] = useState<TYoutuber[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: restorants } = await supabase
        .from("restorant")
        .select("*")
        .order("createdAt", { ascending: false })
        .limit(5);

      const { data: youtuberData } = await supabase
        .from("youtuber")
        .select("*")
        .limit(10);

      if (restorants) setRecentRestorants(restorants);
      if (youtuberData) setYoutubers(youtuberData);
    };

    fetchData();
  }, []);

  return (
    <Container>
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20 px-4 mb-8 rounded-lg">
        <h1 className="text-4xl font-bold mb-4">유튜브 먹방 맛집 랭킹</h1>
        <p className="text-xl mb-6">
          유튜버들이 추천하는 최고의 맛집을 찾아보세요!
        </p>
        <Link
          href="/rank"
          className="bg-white text-blue-500 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors"
        >
          랭킹 보기
        </Link>
      </div>

      {/* Recent Restorants Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">최근 등록된 맛집</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentRestorants.map((restorant) => (
            <Link
              href={`/r/${restorant.id}`}
              key={restorant.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {restorant.heroBannerSrc && (
                <Image
                  src={restorant.heroBannerSrc}
                  alt={restorant.name}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover mb-4 rounded"
                />
              )}
              <h3 className="font-semibold text-lg mb-2">{restorant.name}</h3>
              <p className="text-gray-600">{restorant.locationText}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Youtubers Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">인기 유튜버</h2>
        <div className="flex overflow-x-auto space-x-4 pb-4">
          {youtubers.map((youtuber) => (
            <Link
              href={`/y/${youtuber.id}`}
              key={youtuber.id}
              className="flex-shrink-0"
            >
              <Image
                src={youtuber.profileImage}
                alt={youtuber.channelName}
                width={64}
                height={64}
                className="rounded-full"
              />
            </Link>
          ))}
        </div>
      </section>
    </Container>
  );
}
