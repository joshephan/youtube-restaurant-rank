import CreateUpdateTemplate from "@/components/CreateUpdateTemplate";
import React, { Suspense } from "react";

export default function page() {
  return (
    <Suspense fallback={<div>Loading ... </div>}>
      <CreateUpdateTemplate />
    </Suspense>
  );
}
