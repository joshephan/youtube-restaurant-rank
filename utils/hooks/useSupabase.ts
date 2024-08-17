"use client";
import { useUser, useYoutuber } from "@/store";
import { createClient } from "../supabase/client";
import { useCallback, useEffect } from "react";

export const useSupabase = () => {
  const supabase = createClient();
  const { id, email, login, logout } = useUser();
  const { list, setYoutuber } = useYoutuber();

  const getUser = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      login({
        id: user.id,
        email: user.email,
        name: user.user_metadata.name,
        avatar_url: user.user_metadata.avatar_url,
        load: true,
      });
      return;
    }

    login({
      id: "",
      email: "",
      name: "",
      avatar_url: "",
      load: true,
    });
  }, [id]);

  const getYoutubers = useCallback(async () => {
    const { data: youtuber } = await supabase.from("youtuber").select();

    if (youtuber) {
      setYoutuber(youtuber);
    }
  }, [list]);

  // console.log("user: ", user);

  const signOut = async () => {
    await supabase.auth.signOut();
    logout();
  };

  useEffect(() => {
    if (id === "") {
      getUser();
    }
    if (list.length === 0) {
      getYoutubers();
    }
  }, [id, list]);

  return {
    supabase,
    id,
    email,
    signOut,
  };
};
