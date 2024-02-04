"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Hint } from "@/components/Hint";
import { useRenameModal } from "@/hooks/strore/use-rename-modal";
import { Actions } from "@/components/Actions";
import { MenuIcon, MenuSquareIcon } from "lucide-react";

interface InfoProps {
  boardId: string;
}

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

const TabSaperator = () => {
  return <div className="text-neutral-300 px-1.5"> | </div>;
};

export const Info = ({ boardId }: InfoProps) => {
  const { onOpen } = useRenameModal();
  const data = useQuery(api.board.get, { id: boardId as Id<"boards"> });

  if (!data) {
    return <InfoSkeleton />;
  }

  return (
    <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md">
      <Hint label="Go to Boards" side="bottom" sideOffset={10}>
        <Button asChild variant="board" className="px-2">
          <Link href="/">
            <Image src="/logo.svg" alt="Board Logo" height={40} width={40} />
            <span
              className={cn(
                "font-semibold text-xl ml-2 text-black",
                font.className
              )}
            >
              Big Board
            </span>
          </Link>
        </Button>
      </Hint>
      <TabSaperator />
      <Hint label="Edit Title" side="bottom" sideOffset={10}>
        <Button
          variant="board"
          onClick={() => onOpen(data._id, data.title)}
          className="text-base font-normal px-2"
        >
          {data.title}
        </Button>
      </Hint>
      <TabSaperator />
      <Actions id={data._id} title={data.title} side="bottom" sideOffset={10}>
        <div>
          <Hint label="Main Menu" side="bottom" sideOffset={10}>
            <Button size="icon" variant="board">
              <MenuIcon />
            </Button>
          </Hint>
        </div>
      </Actions>
    </div>
  );
};
export function InfoSkeleton() {
  return (
    <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md">
      <Skeleton className="h-full w-full bg-muted" />
    </div>
  );
}
