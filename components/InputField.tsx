import React from "react";

/**
 * 입력 필드와 라벨을 일괄 관리
 * @param param0
 * @returns
 */
export default function InputField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <section>
      <label htmlFor={label}>{label}</label>
      <input
        id={label}
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
    </section>
  );
}
