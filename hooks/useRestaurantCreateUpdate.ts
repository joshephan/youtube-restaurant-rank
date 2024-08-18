"use client";
import { IMenu } from "@/types";
import { useRestaurantRead } from "./useRestaurantRead";
import { useEffect, useState } from "react";
import { useUser, useYoutuber } from "@/store";
import toast from "react-hot-toast";
import { useSupabase } from "./useSupabase";
import { usePathname, useRouter } from "next/navigation";

export const useRestaurantCreateUpdate = () => {
  const { id } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const { supabase } = useSupabase();
  const { list: YOUTUBER_LIST } = useYoutuber();
  const [pageLoad, setPageLoad] = useState<boolean>(false);
  const [step, setStep] = useState<number>(0);
  const [page, setPage] = useState<"create" | "update">("create");
  const { restaurant, setRestaurant } = useRestaurantRead();
  const [requestLoading, setRequestLoading] = useState<boolean>(false);
  const [youtubers, setYoutubers] = useState<number[]>([]);
  const [menuItems, setMenus] = useState<IMenu[]>([
    {
      id: 0, // 최초 생성인 경우에는 아이디는 객체에서 삭제
      authorId: "",
      name: "",
      restaurantId: 0,
      price: 0,
      description: null,
      imageSrc: null,
      category: "",
    },
  ]);

  useEffect(() => {
    if (pathname.includes("update")) {
      setPage("update");
    } else {
      setPage("create");
    }
    setPageLoad(true);
  }, [pathname]);

  // 수정인 경우에 유튜버 목록을 세팅
  useEffect(() => {
    if (restaurant.youtubers && restaurant.youtubers.length > 0) {
      setYoutubers(restaurant.youtubers.map((el) => el.id));
    }
  }, [restaurant.youtubers]);

  // 수정인 경우에 메뉴 목록을 세팅
  useEffect(() => {
    if (restaurant.restaurant_menu && restaurant.restaurant_menu.length > 0) {
      setMenus(restaurant.restaurant_menu);
    }
  }, [restaurant.restaurant_menu]);

  const addMenuItem = () => {
    setMenus((prev: IMenu[]) => [
      ...prev,
      {
        id: 0,
        authorId: id,
        restaurantId: 0,
        name: "",
        price: 0,
        description: null,
        imageSrc: null,
        category: "한식",
      },
    ]);
  };

  const removeMenuItem = (index: number) => {
    setMenus((prev: IMenu[]) => {
      return prev.filter((_, i) => i !== index);
    });
  };

  const createRestaurant = async () => {
    if (requestLoading) {
      return;
    }

    // 메뉴가 1개 이상 등록되어 있어야 함
    if (menuItems.length === 0) {
      toast.error("🍔 메뉴를 1개 이상 등록해주세요!!");
      return;
    }

    // Validate menuItems
    for (const menu of menuItems) {
      if (!menu.name || menu.name.trim() === "") {
        toast.error("🍽️ 모든 메뉴의 이름을 입력해주세요.");
        return;
      }
      if (menu.price <= 0) {
        toast.error("💰 모든 메뉴의 가격은 0보다 커야 합니다.");
        return;
      }
      if (!menu.category) {
        toast.error("🍳 모든 메뉴의 카테고리를 선택해주세요.");
        return;
      }
      // Optional: Check if description is provided (if it's required)
      // if (!menu.description || menu.description.trim() === '') {
      //   toast.error("📝 모든 메뉴의 설명을 입력해주세요.");
      //   return;
      // }
      // Optional: Check if image is provided (if it's required)
      // if (!menu.imageSrc) {
      //   toast.error("🖼️ 모든 메뉴의 이미지를 업로드해주세요.");
      //   return;
      // }
    }

    // 유튜버도 1명 이상 체크가 되어야 함
    if (youtubers.length === 0) {
      toast.error("🍖 유튜버를 1명 이상 선택해주세요!!");
      return;
    }

    setRequestLoading(true);

    const { id: _, ...payloadRestaurantWithoutId } = restaurant;

    // 식당 정보를 입력
    const { data: insertedRestaurant, error: restaurantError } = await supabase
      .from("restaurant")
      .insert({ ...payloadRestaurantWithoutId, authorId: id })
      .select("id");

    if (restaurantError) {
      console.error("Error inserting restaurant:", restaurantError);
      toast.error("🥘 식당 업로드가 실패했습니다!!");
      setRequestLoading(false);
      return;
    }

    if (!insertedRestaurant || insertedRestaurant.length === 0) {
      console.error("Failed to get inserted restaurant ID");
      toast.error("💩 서비스가 뭔가가 실패했습니다!!");
      setRequestLoading(false);
      return;
    }

    const newRestaurantId = insertedRestaurant[0].id;

    // Insert entries into restaurant_youtuber table
    const { error: youtuberError } = await supabase
      .from("restaurant_youtuber")
      .insert(
        youtubers.map((youtuberId) => ({
          restaurantId: newRestaurantId,
          youtuberId: youtuberId,
        }))
      );

    if (youtuberError) {
      console.error(
        "Error inserting restaurant_youtuber entries:",
        youtuberError
      );
      toast.error("🎥 유튜버 연결에 실패했습니다!!");
      setRequestLoading(false);
      return;
    }

    // Insert menu items and get their IDs
    const { error: menuError } = await supabase.from("restaurant_menu").insert(
      menuItems.map((el) => {
        const { id: _, ...menuWithoutId } = el;
        return {
          ...menuWithoutId,
          authorId: id,
          restaurantId: newRestaurantId,
        };
      })
    );

    if (menuError) {
      console.error("Error inserting menu items:", menuError);
      toast.error("🍔 메뉴 업로드가 실패했습니다!!");
      setRequestLoading(false);
      return;
    }

    // 히스토리 정보 추가
    const { error: historyError } = await supabase
      .from("history")
      .insert({ ...payloadRestaurantWithoutId, authorId: id });

    if (historyError) {
      console.error("Failed to create history");
      toast.error("💩 기록 생성이 실패했습니다!!");
      setRequestLoading(false);
    }

    if (insertedRestaurant && insertedRestaurant.length > 0) {
      const newRestaurantId = insertedRestaurant[0].id;
      router.push(`/r/${newRestaurantId}`);
    } else {
      console.error("Failed to get inserted restaurant ID");
      toast.error("💩 서비스가 뭔가가 실패했습니다!!");
      setRequestLoading(false);
    }
  };

  const updateRestaurant = async () => {
    if (requestLoading) {
      return;
    }

    // 메뉴가 1개 이상 등록되어 있어야 함
    if (menuItems.length === 0) {
      toast.error("🍔 메뉴를 1개 이상 등록해주세요!!");
      return;
    }

    // Validate each menu item
    for (const menuItem of menuItems) {
      if (!menuItem.name || menuItem.name.trim() === "") {
        toast.error("🍽️ 모든 메뉴에 이름을 입력해주세요!");
        return;
      }
      if (!menuItem.price || menuItem.price <= 0) {
        toast.error("💰 모든 메뉴에 올바른 가격을 입력해주세요!");
        return;
      }
      if (!menuItem.category) {
        toast.error("🏷️ 모든 메뉴에 카테고리를 선택해주세요!");
        return;
      }
      if (!menuItem.imageSrc) {
        toast.error("🖼️ 모든 메뉴에 이미지를 업로드해주세요!");
        return;
      }
    }

    setRequestLoading(true);

    // Update restaurant details
    const { error: restaurantError } = await supabase
      .from("restaurants")
      .update(restaurant)
      .eq("id", restaurant.id);

    if (restaurantError) {
      console.error("Error updating restaurant:", restaurantError);
      toast.error("🏠 식당 정보 업데이트에 실패했습니다!");
      setRequestLoading(false);
      return;
    }

    // Compare and update youtuber associations
    const existingYoutubers = restaurant.youtubers?.map((y) => y.id) || [];
    const youtubersToAdd = youtubers.filter(
      (id) => !existingYoutubers.includes(id)
    );
    const youtubersToRemove = existingYoutubers.filter(
      (id) => !youtubers.includes(id)
    );

    if (youtubersToRemove.length > 0) {
      const { error: deleteYoutuberError } = await supabase
        .from("restaurant_youtuber")
        .delete()
        .eq("restaurantId", restaurant.id)
        .in("youtuberId", youtubersToRemove);

      if (deleteYoutuberError) {
        console.error(
          "Error deleting youtuber associations:",
          deleteYoutuberError
        );
        toast.error("🎥 유튜버 연결 삭제에 실패했습니다!");
        setRequestLoading(false);
        return;
      }
    }

    if (youtubersToAdd.length > 0) {
      const { error: youtuberError } = await supabase
        .from("restaurant_youtuber")
        .insert(
          youtubersToAdd.map((youtuberId) => ({
            restaurantId: restaurant.id,
            youtuberId: youtuberId,
          }))
        );

      if (youtuberError) {
        console.error(
          "Error inserting restaurant_youtuber entries:",
          youtuberError
        );
        toast.error("🎥 유튜버 연결에 실패했습니다!");
        setRequestLoading(false);
        return;
      }
    }

    // Compare and update menu items
    const existingMenuIds = restaurant.restaurant_menu?.map((m) => m.id) || [];
    const menuItemsToAdd = menuItems.filter(
      (item) => !item.id || !existingMenuIds.includes(item.id)
    );
    const menuItemsToRemove = existingMenuIds.filter(
      (id) => !menuItems.some((item) => item.id === id)
    );
    const menuItemsToUpdate = menuItems.filter(
      (item) => item.id && existingMenuIds.includes(item.id)
    );

    if (menuItemsToRemove.length > 0) {
      const { error: deleteMenuError } = await supabase
        .from("restaurant_menu")
        .delete()
        .eq("restaurantId", restaurant.id)
        .in("id", menuItemsToRemove);

      if (deleteMenuError) {
        console.error("Error deleting menu items:", deleteMenuError);
        toast.error("🍔 메뉴 삭제에 실패했습니다!");
        setRequestLoading(false);
        return;
      }
    }

    if (menuItemsToAdd.length > 0) {
      const { error: addMenuError } = await supabase
        .from("restaurant_menu")
        .insert(
          menuItemsToAdd.map((item) => ({
            ...item,
            id: undefined, // Remove id for new items
            authorId: id,
            restaurantId: restaurant.id,
          }))
        );

      if (addMenuError) {
        console.error("Error adding menu items:", addMenuError);
        toast.error("🍔 새 메뉴 추가에 실패했습니다!");
        setRequestLoading(false);
        return;
      }
    }

    if (menuItemsToUpdate.length > 0) {
      const { error: updateMenuError } = await supabase
        .from("restaurant_menu")
        .upsert(
          menuItemsToUpdate.map((item) => ({
            ...item,
            authorId: id,
            restaurantId: restaurant.id,
          }))
        );

      if (updateMenuError) {
        console.error("Error updating menu items:", updateMenuError);
        toast.error("🍔 메뉴 업데이트에 실패했습니다!");
        setRequestLoading(false);
        return;
      }
    }

    // 히스토리 정보 추가
    const { error: historyError } = await supabase
      .from("history")
      .insert({ ...restaurant, authorId: id });

    if (historyError) {
      console.error("Failed to create history");
      toast.error("💩 기록 생성이 실패했습니다!!");
      setRequestLoading(false);
    }

    setRequestLoading(false);
    toast.success("🎉 식당 정보가 성공적으로 업데이트되었습니다!");
    router.push(`/r/${restaurant.id}`);
  };

  return {
    page,
    pageLoad,
    step,
    setStep,
    menuItems,
    setMenus,
    addMenuItem,
    removeMenuItem,
    createRestaurant,
    updateRestaurant,
    restaurant,
    setRestaurant,
    setYoutubers,
    requestLoading,
    YOUTUBER_LIST,
  };
};
