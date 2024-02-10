import { useEffect } from "react";

export const useDisableScrollDown = () => {
  useEffect(() => {
    document.body.classList.add("overflow-hidden", "overscroll-none");

    return () => {
      document.body.classList.remove("overflow-hidden", "overscroll-none");
    };
  }, []);
};
