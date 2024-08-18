"use client";
import CategoryRadioGroup from "@/components/CategoryRadioGroup";
import Container from "@/components/Container";
import ImageUpload from "@/components/ImageUpload";
import InputField from "@/components/InputField";
import { RestaurantEditableField, TYoutuber } from "@/types";
import { mergeClassNames } from "@/utils/convert";
import { IconSalad, IconTrashXFilled } from "@tabler/icons-react";
import Image from "next/image";
import React from "react";
import { STRINGTYPE_INPUT_FIELDS } from "@/constants";
import { useRestaurantCreateUpdate } from "@/hooks/useRestaurantCreateUpdate";

const SubTitle = ({ children }: { children: React.ReactNode }) => {
  return <h2 className="font-medium text-lg">{children}</h2>;
};

const CardContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative">{children}</div>;
};

const ContinueButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      className="bg-red-500 text-white px-4 py-2 rounded-2xl font-medium hover:bg-red-600 transition-colors duration-300"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      다음으로
    </button>
  );
};

const PrevButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      className="bg-gray-500 text-white px-4 py-2 rounded-2xl font-medium hover:bg-gray-600 transition-colors duration-300"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      이전으로
    </button>
  );
};

/**
 * 식당 등록 수정시에 공용으로 사용되는 템플릿입니다
 */
export default function CreateUpdateTemplate() {
  const {
    page,
    pageLoad,
    step,
    setStep,
    addMenuItem,
    requestLoading,
    removeMenuItem,
    createRestaurant,
    updateRestaurant,
    YOUTUBER_LIST,
    menuItems,
    setMenus,
    setYoutubers,
    restaurant,
    setRestaurant,
  } = useRestaurantCreateUpdate();

  if (!pageLoad) {
    return;
  }

  return (
    <Container>
      <section className="flex flex-col gap-2">
        {step === 0 && (
          <>
            <h1 className="text-3xl font-medium">
              {page === "create" ? "신규 식당 등록하기" : "식당 정보 수정하기"}
            </h1>
            <p className="text-gray-500 mb-5">
              {page === "create"
                ? "유튜버가 추천한 식당을 새로 추가합니다."
                : "이미 등록된 식당의 정보를 수정하거나 메뉴, 추천한 유튜버 목록 등을 추가합니다."}
            </p>
            <SubTitle>식당 정보</SubTitle>
            <CardContainer>
              {STRINGTYPE_INPUT_FIELDS.map((el) => (
                <InputField
                  key={el.label}
                  label={el.label}
                  // @ts-ignore
                  value={restaurant[el.key as keyof RestaurantEditableField]}
                  onChange={(value) => {
                    setRestaurant((prev) => ({
                      ...prev,
                      [el.key]: value,
                    }));
                  }}
                />
              ))}
              <CategoryRadioGroup
                id="restaurant"
                value={restaurant.category}
                onChange={(value) => {
                  setRestaurant((prev) => ({
                    ...prev,
                    category: value,
                  }));
                }}
              />
              <h3>식당 대표 이미지</h3>
              <ImageUpload
                onImageChange={(url) => {
                  setRestaurant((prev) => ({
                    ...prev,
                    heroBannerSrc: url,
                  }));
                }}
                initialImageSrc={restaurant.heroBannerSrc}
              />
            </CardContainer>
            <div className="py-5 max-w-72 w-full">
              <ContinueButton
                onClick={() => {
                  setStep(1);
                }}
              />
            </div>
          </>
        )}
        {step === 1 && (
          <>
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
                <button
                  onClick={() => removeMenuItem(index)}
                  className={mergeClassNames(
                    "absolute right-3 top-3",
                    "flex gap-1 items-center", // display & alignment
                    "p-2 rounded-md", // margin padding border radius
                    "bg-rose-500 text-white hover:bg-rose-700", // color bg
                    "transition-all duration-200" // transition
                  )}
                >
                  <IconTrashXFilled size={16} />
                </button>
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
                <CategoryRadioGroup
                  id="menu"
                  value={menu.category}
                  onChange={(value) => {
                    setMenus((prev) => {
                      const newMenus = [...prev];
                      newMenus[index].category = value;
                      return newMenus;
                    });
                  }}
                />
                <ImageUpload
                  onImageChange={(url) => {
                    setMenus((prev) => {
                      const newMenus = [...prev];
                      newMenus[index].imageSrc = url;
                      return newMenus;
                    });
                  }}
                  initialImageSrc={menu.imageSrc!}
                />
              </CardContainer>
            ))}
            <div className="py-5 max-w-72 w-full gap-2 flex">
              <PrevButton
                onClick={() => {
                  setStep(0);
                }}
              />
              <ContinueButton
                onClick={() => {
                  setStep(2);
                }}
              />
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <SubTitle>유튜버</SubTitle>
            <div className="flex flex-col gap-2">
              {YOUTUBER_LIST.map((el: TYoutuber) => {
                return (
                  <label
                    key={`${el.id}-checkbox`}
                    htmlFor={`${el.id}`}
                    className="flex gap-2 items-center cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      id={`${el.id}`}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setYoutubers((prev) => [...prev, el.id]);
                        } else {
                          setYoutubers((prev) =>
                            prev.filter((id) => id !== el.id)
                          );
                        }
                      }}
                    />
                    <Image
                      src={el.profileImage}
                      width={48}
                      height={48}
                      className="rounded-full select-none"
                      alt={el.channelName}
                    />
                    <div className="select-none">{el.channelName}</div>
                  </label>
                );
              })}
            </div>
            <div className="py-5 max-w-72 w-full gap-2 flex">
              <PrevButton
                onClick={() => {
                  setStep(1);
                }}
              />
              <button
                disabled={requestLoading}
                onClick={async () => {
                  page === "create"
                    ? await createRestaurant()
                    : await updateRestaurant();
                }}
                className={mergeClassNames(
                  "flex gap-1 items-center", // display & alignment
                  "px-4 py-2 rounded-2xl font-medium", // margin padding border radius
                  "bg-blue-500 text-white hover:bg-blue-700", // color bg
                  "transition-all duration-200", // transition
                  "disabled:opacity-70"
                )}
              >
                <IconSalad size={20} />
                <span>식당 {page === "create" ? "추가하기" : "수정하기"}</span>
              </button>
            </div>
          </>
        )}
      </section>
    </Container>
  );
}
