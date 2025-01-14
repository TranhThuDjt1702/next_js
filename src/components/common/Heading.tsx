import { cn } from "@/lib/utils";
import React from "react";


const Heading = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("font-bold text-2xl lg:text-3xl pl-5 ", className)}>
      {children}
    </div>
  );
};

export default Heading;
