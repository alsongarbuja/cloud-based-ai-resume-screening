"use client";

import { useMutation } from "@tanstack/react-query";
import { Button } from "../ui";

export function PredictButton({ id, token }: { id: number; token: string }) {
  const { mutateAsync } = useMutation({
    mutationKey: ["predict", id],
    mutationFn: async (jobId: number) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ai/predict`, {
        method: "POST",
        body: JSON.stringify({ jobId }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      console.log(data);
    },
  });

  return (
    <Button
      className="my-2"
      variant="outline"
      onClick={async () => {
        await mutateAsync(id);
      }}
    >
      Rank with KaamAI
    </Button>
  );
}
