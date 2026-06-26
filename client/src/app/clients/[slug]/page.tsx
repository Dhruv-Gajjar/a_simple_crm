"use client";

import { use } from "react";

export default function ClientDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  return (
    <div>
      <p>Page: {slug}</p>
    </div>
  );
}
