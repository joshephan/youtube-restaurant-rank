import React from "react";

export default function CategoryRadioGroup({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (category: string) => void;
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        카테고리
      </label>
      <div className="flex flex-wrap gap-4">
        {["한식", "양식", "일식", "중식", "분식", "디저트", "밀키트"].map(
          (category, index) => (
            <label
              key={`${id}-${category}`}
              className="inline-flex items-center"
            >
              <input
                type="radio"
                className="form-radio"
                name={`category-${index}`}
                value={category}
                checked={value === category}
                onChange={(e) => {
                  onChange(e.target.value);
                }}
              />
              <span className="ml-2">{category}</span>
            </label>
          )
        )}
      </div>
    </div>
  );
}
