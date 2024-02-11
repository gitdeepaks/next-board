"use client";

import { useProModal } from "@/hooks/strore/use-pro-modal";
import { Dialog, DialogContent } from "../ui/dialog";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { useOrganization } from "@clerk/nextjs";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const ProModal = () => {
  const { isOpen, onClose } = useProModal();

  const pay = useAction(api.stripe.pay);

  const [pending, setPending] = useState(false);

  const { organization } = useOrganization();

  const handleUpgrade = async () => {
    if (!organization?.id) return;

    try {
      const redirectUrl = await pay({ orgId: organization.id });

      window.location.href = redirectUrl;
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[340px] p-0 overflow-hidden">
        <div className="aspect-video relative flex items-center justify-center">
          <Image src="/pro.svg" alt="Pro" className="object-fit" fill />
        </div>
        <div
          className={cn(
            "text-neutral-700 mx-auto space-y-6 p-6",
            font.className
          )}
        >
          <h2 className="font-medium text-lg">🚀 Upgrade to Pro today!</h2>
          <div className="pl-3">
            <ul className="text-[11px] space-y-1 list-disc">
              <li>Unlimited Boards</li>
              <li>Unlimited Tools</li>
              <li>Unlimited Organizations</li>
              <li>Unlimited Members</li>
            </ul>
          </div>
          <Button
            onClick={handleUpgrade}
            disabled={pending}
            size="sm"
            className="w-full"
          >
            Upgrade
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
