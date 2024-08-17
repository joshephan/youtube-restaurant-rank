import React from "react";

/**
 * 최상위 컨테이너
 */
export default function Container({ children }: { children: React.ReactNode }) {
  return <div className="max-w-screen-xl mx-auto w-full p-5">{children}</div>;
}
