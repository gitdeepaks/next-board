"use client";

import { useProModal } from "@/hooks/strore/use-pro-modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export const ProModal = () => {
  const { isOpen, onClose } = useProModal();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pro Modal</DialogTitle>
        </DialogHeader>
        <DialogDescription>This is a Pro modal!</DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
