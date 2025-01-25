'use client';

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { X } from 'lucide-react';
import { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
  footer?: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
}>;

const Modal = ({ children, footer, open, setOpen, title }: Props) => (
  <Dialog open={open} onClose={setOpen} className="relative z-10">
    <DialogBackdrop
      transition
      className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
    />
    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div className="flex min-h-full items-start justify-center p-4 text-center sm:p-0">
        <DialogPanel
          transition
          className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                {title}
              </DialogTitle>
              <button type="button" className="text-gray-400 hover:text-gray-500" onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>
            {children}
          </div>
          {footer && <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">{footer}</div>}
        </DialogPanel>
      </div>
    </div>
  </Dialog>
);

export default Modal;
