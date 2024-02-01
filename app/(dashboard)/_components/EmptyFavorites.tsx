import Image from "next/image";
import React from "react";

interface EmptySearchProps {}

export const EmptyFavorites = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image src="/empty-favorites.svg" height={240} width={240} alt="Empty" />
      <h2 className="text-2xl font-semibold mt-6">No Favorites found!</h2>

      <p className="text-muted-foreground text-sm mt-2">
        Try Searching some other favorites else
      </p>
    </div>
  );
};
