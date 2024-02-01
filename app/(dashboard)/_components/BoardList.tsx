"use client";

import React from "react";
import { EmptySearch } from "./EmptySearch";
import { EmptyFavorites } from "./EmptyFavorites";
import { EmptyBoards } from "./EmptyBoards";

interface BoardListProps {
  orgId: string;
  query: {
    favorites?: string;
    search?: string;
  };
}

export const BoardList = ({ orgId, query }: BoardListProps) => {
  const data = []; //TODO:Change to API call

  if (!data?.length && query.search) {
    return <EmptySearch />;
  }

  if (!data?.length && query.favorites) {
    return <EmptyFavorites />;
  }

  if (!data?.length) {
    return <EmptyBoards />;
  }

  return <div>{JSON.stringify(query)}</div>;
};
