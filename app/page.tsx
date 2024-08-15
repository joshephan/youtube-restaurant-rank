import { createClient } from "@/utils/supabase/server";

/**
 * 식당별 랭킹 순서로 리스트를 보여줍니다.
 */
export default async function Home() {
  const supabase = createClient();
  const { data: restorant } = await supabase.from("restorant").select();
  const { data: youtuber } = await supabase.from("youtuber").select();

  return <main></main>;
}
