"use client";
import Link from "next/link";
import Image from "next/image";

import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { OrganizationSwitcher, useOrganization } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Banknote, LayoutDashboard, Star } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export const OrgSideBar = () => {
  const searchParams = useSearchParams();
  const favorites = searchParams.get("favorites");

  const { organization } = useOrganization();
  const isSubscriptionActive = useQuery(
    api.subscritions.getIsSunscriptionActive,
    {
      ordId: organization?.id,
    }
  );

  const portal = useAction(api.stripe.portal);
  const pay = useAction(api.stripe.pay);
  const [pending, setPending] = useState(false);

  const onCLick = async () => {
    if (!organization?.id) return;

    setPending(true);
    try {
      const action = isSubscriptionActive ? portal : pay;
      const redirectUrl = await action({ orgId: organization.id });

      window.location.href = redirectUrl;
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="hidden lg:flex flex-col space-y-6 w-[206px] pl-5 pt-5">
      <Link href="/">
        <div className="flex items-center gap-x-2">
          <Image src="/logo.svg" width={60} height={60} alt="logo" />
          {isSubscriptionActive ? (
            <span className={cn("font-sm text-xl", font.className)}>
              BigBoard Pro
            </span>
          ) : (
            <span className={cn("font-sm text-xl", font.className)}>
              Big Board
            </span>
          )}
        </div>
      </Link>
      <OrganizationSwitcher
        hidePersonal
        appearance={{
          elements: {
            rootBox: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            },
            organizationSwitcherTrigger: {
              padding: "6px",
              width: "100%",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              justifyContent: "space-between",
              backgroundColor: "white",
            },
          },
        }}
      />
      <div className="space-y-1 w-full">
        <Button
          variant={favorites ? "ghost" : "secondary"}
          className="font-normal justify-start px-2 w-full "
          size="lg"
          asChild
        >
          <Link href="/">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Team Board
          </Link>
        </Button>
        <Button
          variant={favorites ? "secondary" : "ghost"}
          className="font-normal justify-start px-2 w-full "
          size="lg"
          asChild
        >
          <Link
            href={{
              pathname: "/",
              query: { favorites: true },
            }}
          >
            <Star className="h-4 w-4 mr-2" />
            Favourate Board
          </Link>
        </Button>
        <Button
          onClick={onCLick}
          disabled={pending}
          variant="ghost"
          size="lg"
          className="font-normal justify-start px-2 w-full"
        >
          <Banknote className="h-4 w-4 mr-2" />
          {isSubscriptionActive ? "Payment Settings" : "Upgrade"}
        </Button>
      </div>
    </div>
  );
};
