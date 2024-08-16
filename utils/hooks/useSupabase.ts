"use client";
import { useUser, useYoutuber } from "@/store";
import { createClient } from "../supabase/client";
import { useEffect } from "react";

export const useSupabase = () => {
  const supabase = createClient();
  const { id, email, login, logout } = useUser();
  const { setYoutuber } = useYoutuber();

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      login({
        id: user.id,
        email: user.email,
        load: true,
      });
      return;
    }

    login({
      id: "",
      email: "",
      load: true,
    });
  };

  const getYoutubers = async () => {
    const { data: youtuber } = await supabase.from("youtuber").select();

    if (youtuber) {
      setYoutuber(youtuber);
    }
  };

  // console.log("user: ", user);

  const signOut = async () => {
    await supabase.auth.signOut();
    logout();
  };

  useEffect(() => {
    getUser();
    getYoutubers();
  }, [id]);

  return {
    supabase,
    id,
    email,
    signOut,
  };
};
