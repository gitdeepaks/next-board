"use client";
import React, { use } from "react";

import { memo } from "react";

import { useOthersConnectionIds } from "@/liveblocks.config";
import { Cursor } from "./Cursor";

const Cursors = () => {
  const ids = useOthersConnectionIds();
  return (
    <>
      {ids.map((connectionId) => (
        <Cursor key={connectionId} connectionId={connectionId} />
      ))}
    </>
  );
};

export const CursorsPresence = memo(() => {
  return (
    <>
      {/* TODO:Draft Pencil */}
      <Cursors />
    </>
  );
});

CursorsPresence.displayName = "CursorsPresence";
