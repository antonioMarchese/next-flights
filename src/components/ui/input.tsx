import * as React from "react";

import { cn } from "@/lib/utils";
import { useFormField } from "./form";
import { IconType } from "@/utils/types";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: IconType;
}

const FormInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon: Icon, ...props }, ref) => {
    const { error } = useFormField();
    return (
      <div className="relative w-full">
        {Icon && (
          <Icon className="size-5 absolute top-1/2 -translate-y-1/2 left-2 cursor-pointer text-zinc-400 hover:text-zinc-300 transition-colors" />
        )}

        <input
          type={type}
          className={cn(
            "w-full h-10 lg:h-12 bg-transparent disabled:bg-neutral-300 disabled:text-neutral-400 py-3 pl-4 flex items-center justify-between rounded-md border placeholder:text-neutral-400 text-white border-zinc-500 focus:border-zinc-400 outline-none text-[14px] lg:text-base font-medium",
            Icon && "pl-8",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
FormInput.displayName = "Input";

export { FormInput };
