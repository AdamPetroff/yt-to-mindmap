"use client";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { proxy, useSnapshot } from "valtio";
import { DeviceType, useDeviceType } from "@/lib/hooks/useDeviceType";
import { Cross2Icon } from "@radix-ui/react-icons";
import { ButtonLoader } from "./ui/button";

export type ModalContentProps = { onClose: () => void };
export type ModalData =
  | undefined
  | {
      title: React.ReactNode;
      key?: string;
      content: (props: ModalContentProps) => React.ReactNode;
      justContent?: boolean;
      onClose?: () => void;
    };

export const modalAtom = proxy<{ modal: ModalData }>({ modal: undefined });
export const setModal = (data: ModalData) => {
  modalAtom.modal = data;
};

export default function Modal() {
  const snap = useSnapshot(modalAtom);
  const modal = snap.modal;
  function onClose() {
    if (modalAtom.modal?.title === modal?.title) {
      setModal(undefined);
    }
    modal?.onClose?.();
  }
  const isMobile = useDeviceType(DeviceType.mobile);

  const backdrop = (
    <motion.div
      variants={{
        open: {
          backdropFilter: "blur(5px)",
        },
        close: {
          backdropFilter: "blur(0px)",
        },
      }}
      initial="close"
      animate="open"
      exit="close"
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="t-0 l-0 fixed h-screen w-screen bg-black/20 backdrop-blur-sm"
      onClick={onClose}
    ></motion.div>
  );

  return (
    <>
      <AnimatePresence>
        {!!modal ? (
          <>
            {backdrop}
            <motion.div
              variants={{
                closed: isMobile
                  ? {
                      opacity: 0,
                      translateY: "100%",
                    }
                  : {
                      opacity: 0,
                      scale: 0.75,
                    },
                open: isMobile
                  ? {
                      opacity: 1,
                      translateY: "0%",
                    }
                  : {
                      opacity: 1,
                      scale: 1,
                    },
              }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              initial="closed"
              animate="open"
              exit="closed"
              className="pointer-events-none fixed z-50 flex max-h-screen items-center justify-center sm:bottom-0 sm:top-auto sm:w-screen sm:translate-y-0 sm:p-0"
              key={
                modal.key || typeof modal.title === "string"
                  ? (modal.title as string)
                  : undefined
              }
            >
              <div className="mx-0 rounded-xl border-2 border-blue-400 bg-blue-900/90 text-slate-100 backdrop-blur-sm md:mx-4 lg:my-8">
                {modal.title && (
                  <div className="grid grid-cols-[auto,1fr,auto] items-start gap-8">
                    <span className="text-center font-serif text-xl">
                      {modal.title as string}
                    </span>
                    <div
                      className="flex origin-center transform cursor-pointer text-3xl transition duration-200 ease-in sm:text-white sm:opacity-50"
                      onClick={() => setModal(undefined)}
                    >
                      <Cross2Icon onClick={onClose} />
                    </div>
                  </div>
                )}
                {modal.content({ onClose })}
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

const LoadingModalContent = ({
  onClose,
  promise,
}: {
  onClose: () => void;
  promise: Promise<any>;
}) => {
  useEffect(() => {
    promise.finally(onClose);
  }, []);

  return (
    <div className="flex justify-center">
      <ButtonLoader />
    </div>
  );
};

export function throwLoadingModal(promise: Promise<any>, title = "Loading") {
  promise.finally();

  setModal({
    title,
    content: ({ onClose }) => (
      <LoadingModalContent onClose={onClose} promise={promise} />
    ),
  });
}
