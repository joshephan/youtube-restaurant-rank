"use client";
import Container from "@/components/Container";
import InputField from "@/components/InputField";
import { useUser, useYoutuber } from "@/store";
import { InsertedMenu, RestorantEditableField, TYoutuber } from "@/types";
import { mergeClassNames } from "@/utils/convert";
import { useSupabase } from "@/utils/hooks/useSupabase";
import { IconSalad, IconTrashXFilled } from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const STRINGTYPE_INPUT_FIELDS = [
  {
    label: "식당 이름",
    key: "name",
    required: true,
  },
  {
    label: "도로명 주소",
    key: "locationText",
    required: true,
  },
  {
    label: "카테고리(예: 한식)",
    key: "category",
    required: true,
  },
  {
    label: "카카오맵 주소",
    key: "kakaomapUrl",
    required: false,
  },
  {
    label: "네이버맵 주소",
    key: "navermapUrl",
    required: false,
  },
  {
    label: "홈페이지 주소",
    key: "homepageUrl",
    required: false,
  },
];

const SubTitle = ({ children }: { children: React.ReactNode }) => {
  return <h2 className="font-medium text-lg">{children}</h2>;
};

const CardContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="rounded-md shadow-md p-2">{children}</div>;
};

/**
 * 식당 등록시에 사용되는 페이지입니다
 */
export default function CreatePage() {
  const router = useRouter();
  const { supabase } = useSupabase();
  const { list } = useYoutuber();
  const { id } = useUser();
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [menuItems, setMenus] = useState<InsertedMenu[]>([
    {
      authorId: "",
      name: "",
      restorantId: 0,
      price: 0,
      description: null,
      imageSrc: null,
      category: "",
    },
  ]);
  const [restorant, setRestorant] = useState<RestorantEditableField>({
    name: "테스트용 맛집",
    locationText: "테스트용 주소",
    category: "한식",
    kakaomapUrl: "",
    navermapUrl: "",
    homepageUrl: "",
    latitude: "", // api로 콜백으로 넣어야 하는 부분
    longitube: "", // api로 콜백으로 넣어야 하는 부분
    menus: [], // 각각의 메뉴를 추가해야 하니까 UI가 복잡할듯
    youtubers: [], // multi select
  });

  const addMenuItem = () => {
    setMenus((prev: InsertedMenu[]) => [
      ...prev,
      {
        authorId: id,
        restorantId: 0,
        name: "",
        price: 0,
        description: null,
        imageSrc: null,
        category: "",
      },
    ]);
  };

  const removeMenuItem = (index: number) => {
    setMenus((prev: InsertedMenu[]) => {
      return prev.filter((_, i) => i !== index);
    });
  };

  const createRestorant = async () => {
    if (createLoading) {
      return;
    }

    // 메뉴가 1개 이상 등록되어 있어야 함
    if (menuItems.length === 0) {
      toast.error("🍔 메뉴를 1개 이상 등록해주세요!!");
      return;
    }

    // TODO: 메뉴가 적합한 데이터가 되는지 validate

    // 유튜버도 1명 이상 체크가 되어야 함
    if (restorant.youtubers.length === 0) {
      toast.error("🍖 유튜버를 1명 이상 선택해주세요!!");
      return;
    }

    setCreateLoading(true);

    const { data } = await supabase.from("restorant").select();

    console.log("restorant: ", data);

    // Insert restaurant first
    const { data: insertedRestorant, error: restorantError } = await supabase
      .from("restorant")
      .insert({
        ...restorant,
        authorId: id,
        youtubers: restorant.youtubers.map((el) => el.id),
        menus: [],
      })
      .select("id");

    if (restorantError) {
      console.error("Error inserting restaurant:", restorantError);
      toast.error("🥘 식당 업로드가 실패했습니다!!");
      setCreateLoading(false);
      return;
    }

    if (!insertedRestorant || insertedRestorant.length === 0) {
      console.error("Failed to get inserted restaurant ID");
      toast.error("💩 서비스가 뭔가가 실패했습니다!!");
      setCreateLoading(false);
      return;
    }

    const newRestorantId = insertedRestorant[0].id;

    // Insert menu items and get their IDs
    const { data: insertedMenus, error: menuError } = await supabase
      .from("restorant_menu")
      .insert(
        menuItems.map((el) => ({
          ...el,
          authorId: id,
          restorantId: newRestorantId,
        }))
      )
      .select("id");

    if (menuError || !insertedMenus || insertedMenus.length === 0) {
      console.error("Error inserting menu items:", menuError);
      toast.error("🍔 메뉴 업로드가 실패했습니다!!");
      setCreateLoading(false);
      return;
    }

    // Extract the IDs of the inserted menu items
    const menuIds = insertedMenus.map((menu) => menu.id);

    // Update restaurant with the menu IDs
    const { error: updateError } = await supabase
      .from("restorant")
      .update({ menus: menuIds })
      .eq("id", newRestorantId);

    if (updateError) {
      console.error("Error updating restaurant with menu IDs:", updateError);
      toast.error("🥘 식당 메뉴 업데이트가 실패했습니다!!");
      setCreateLoading(false);
      return;
    }

    if (insertedRestorant && insertedRestorant.length > 0) {
      const newRestorantId = insertedRestorant[0].id;
      router.push(`/r/${newRestorantId}`);
    } else {
      console.error("Failed to get inserted restaurant ID");
      toast.error("💩 서비스가 뭔가가 실패했습니다!!");
      setCreateLoading(false);
    }
  };

  return (
    <Container>
      <section className="grid grid-cols-2">
        <div className="p-4">
          <SubTitle>식당 정보</SubTitle>
          <CardContainer>
            {STRINGTYPE_INPUT_FIELDS.map((el) => (
              <InputField
                key={el.label}
                label={el.label}
                // @ts-ignore
                value={restorant[el.key as keyof RestorantEditableField]}
                onChange={(value) => {
                  setRestorant((prev) => ({
                    ...prev,
                    [el.key]: value,
                  }));
                }}
              />
            ))}
          </CardContainer>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-center">
            <SubTitle>메뉴 정보</SubTitle>
            <button
              className="rounded-lg px-3 py-1 bg-blue-400 text-white font-medium"
              onClick={() => addMenuItem()}
            >
              메뉴 추가
            </button>
          </div>
          {menuItems.map((menu, index) => (
            <CardContainer key={index}>
              <InputField
                label="메뉴 이름"
                value={menu.name}
                onChange={(value) => {
                  setMenus((prev) => {
                    const newMenus = [...prev];
                    newMenus[index].name = value;
                    return newMenus;
                  });
                }}
              />
              <InputField
                label="가격"
                value={menu.price.toString()}
                onChange={(value) => {
                  setMenus((prev) => {
                    const newMenus = [...prev];
                    newMenus[index].price = Number(value);
                    return newMenus;
                  });
                }}
              />
              <InputField
                label="설명"
                value={menu.description || ""}
                onChange={(value) => {
                  setMenus((prev) => {
                    const newMenus = [...prev];
                    newMenus[index].description = value;
                    return newMenus;
                  });
                }}
              />
              <InputField
                label="이미지 주소"
                value={menu.imageSrc || ""}
                onChange={(value) => {
                  setMenus((prev) => {
                    const newMenus = [...prev];
                    newMenus[index].imageSrc = value;
                    return newMenus;
                  });
                }}
              />
              <InputField
                label="카테고리"
                value={menu.category}
                onChange={(value) => {
                  setMenus((prev) => {
                    const newMenus = [...prev];
                    newMenus[index].category = value;
                    return newMenus;
                  });
                }}
              />
              <button
                onClick={() => removeMenuItem(index)}
                className={mergeClassNames(
                  "flex gap-1 items-center", // display & alignment
                  "p-2 rounded-md", // margin padding border radius
                  "bg-rose-500 text-white hover:bg-rose-700", // color bg
                  "transition-all duration-200" // transition
                )}
              >
                <IconTrashXFilled size={16} />
                <span className="text-xs">메뉴 삭제</span>
              </button>
            </CardContainer>
          ))}
        </div>
        <div className="p-4">
          <SubTitle>유튜버 체크</SubTitle>
          <CardContainer>
            {list.map((el: TYoutuber) => {
              return (
                <label
                  key={`${el.id}-checkbox`}
                  htmlFor={`${el.id}`}
                  className="flex gap-2"
                >
                  <input
                    type="checkbox"
                    id={`${el.id}`}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setRestorant((prev) => ({
                          ...prev,
                          youtubers: [...prev.youtubers, el],
                        }));
                      } else {
                        setRestorant((prev) => ({
                          ...prev,
                          youtubers: prev.youtubers.filter(
                            (youtuber) => youtuber.id !== el.id
                          ),
                        }));
                      }
                    }}
                  />
                  <Image
                    src={el.profileImage}
                    width={48}
                    height={48}
                    alt={el.channelName}
                  />
                  <div>{el.channelName}</div>
                </label>
              );
            })}
          </CardContainer>
        </div>
        <div className="p-4">
          <SubTitle>등록</SubTitle>
          <button
            disabled={createLoading}
            onClick={async () => {
              await createRestorant();
            }}
            className={mergeClassNames(
              "flex gap-1 items-center", // display & alignment
              "p-2 rounded-md", // margin padding border radius
              "bg-sky-500 text-white hover:bg-sky-700", // color bg
              "transition-all duration-200", // transition
              "disabled:opacity-70"
            )}
          >
            <IconSalad size={16} />
            <span className="text-xs">식당 추가하기</span>
          </button>
        </div>
      </section>
    </Container>
  );
}
