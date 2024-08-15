import InputField from "@/components/InputField";
import { useYoutuber } from "@/store";
import { IRestorant, RestorantEditableField, TYoutuber } from "@/types";
import Image from "next/image";
import React, { useState } from "react";

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

/**
 * 식당 등록시에 사용되는 페이지입니다
 *
 */
export default function CreatePage() {
  const { list } = useYoutuber();

  const [restorant, setRestorant] = useState<RestorantEditableField>({
    name: "",
    locationText: "",
    category: "",
    kakaomapUrl: "",
    navermapUrl: "",
    homepageUrl: "",
    latitude: "", // api로 콜백으로 넣어야 하는 부분
    longitube: "", // api로 콜백으로 넣어야 하는 부분
    menu: [], // 각각의 메뉴를 추가해야 하니까 UI가 복잡할듯
    youtubers: [], // multi select
  });

  return (
    <div>
      {STRINGTYPE_INPUT_FIELDS.map((el) => (
        <InputField
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
      {list.map((el: TYoutuber) => {
        return (
          <label key={`${el.id}-checkbox`} htmlFor={el.id}>
            <input
              type="checkbox"
              id={el.id}
              onChange={(e) => {
                // 체크가 되면 restorant.youtuber 안에 배열로 추가
                // 체크가 풀리면 배열 아이템이 제거
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
    </div>
  );
}
