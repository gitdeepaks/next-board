"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { api } from "@/convex/_generated/api";
import { useOrganization } from "@clerk/nextjs";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const EmptyBoards = () => {
  const route = useRouter();
  const { organization } = useOrganization();

  const { mutate, pending } = useApiMutation(api.board.create);

  const handleCreate = async () => {
    if (!organization) return;
    mutate({
      orgId: organization.id,
      title: "My First Board",
    })
      .then((id) => {
        toast.success("Board created!");
        route.push(`/board/${id}`);
      })
      .catch((err) => {
        toast.error("Failed to create board");
      });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image src="/note.svg" height={150} width={150} alt="Empty" />
      <h2 className="text-2xl font-semibold mt-6">Create your first board!</h2>

      <p className="text-muted-foreground text-sm mt-2">
        Start by creating a board for your organization
      </p>

      <div className="mt-6">
        <Button disabled={pending} onClick={handleCreate} size="lg">
          Create Board
        </Button>
      </div>
    </div>
  );
};
