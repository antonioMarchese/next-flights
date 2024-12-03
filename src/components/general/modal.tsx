import { XMarkIcon } from "@heroicons/react/24/outline";
import * as Dialog from "@radix-ui/react-dialog";
import { DialogProps } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";

interface GeneralModalProps extends DialogProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export default function Modal({
  onOpenChange,
  title,
  description,
  children,
  open,
}: GeneralModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-blackA6 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-zinc-800 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow overflow-y-auto">
          {title && (
            <Dialog.Title className="m-0 text-[17px] font-medium text-zinc-300">
              {title}
            </Dialog.Title>
          )}
          {description && (
            <Dialog.Description className="mb-5 mt-2.5 text-[15px] leading-normal text-zinc-500">
              {description}
            </Dialog.Description>
          )}
          {children}
          <Dialog.Close asChild>
            <Button
              className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full outline-none"
              aria-label="Close"
            >
              <XMarkIcon className="size-4" />
            </Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
