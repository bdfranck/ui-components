import React, { FC, useEffect, useRef } from "react";

export type ModalTransition = "fast" | "slow" | "none";
export type CalloutVariant =
  | "information"
  | "important"
  | "emergency"
  | "success"
  | "event";

interface WCProps {
  ref: React.RefObject<HTMLElement>;
  heading?: React.ReactNode;
  open?: boolean;
  width?: string;
  closable?: boolean;
  scrollable?: boolean;
  transition?: ModalTransition;
  calloutVariant?: CalloutVariant;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "goa-modal": WCProps & React.HTMLAttributes<HTMLElement>;
    }
  }
}

interface Props {
  heading?: React.ReactNode;
  width?: string;
  actions?: React.ReactElement;
  onClose?: () => void;
  transition?: ModalTransition;
  children?: React.ReactNode;
  open?: boolean;
  type?: string;
  calloutVariant?: CalloutVariant;
  testId?: string;
}

export const GoAModal: FC<Props> = ({
  heading,
  children,
  open,
  width,
  actions,
  transition,
  type,
  calloutVariant,
  onClose,
  testId,
}) => {
  const el = useRef<HTMLElement>(null);

  useEffect(() => {
    if (type) {
      console.warn("GoAModal [type] is deprecated.");
    }
  }, [type]);

  useEffect(() => {
    if (!el.current) {
      return;
    }
    const current = el.current;
    const listener = () => {
      onClose?.();
    };

    current.addEventListener("_close", listener);
    return () => {
      current.removeEventListener("_close", listener);
    };
  }, [el, onClose]);

  return (
    <goa-modal
      ref={el}
      open={open}
      closable={!!onClose}
      scrollable={true}
      width={width}
      transition={transition}
      calloutVariant={calloutVariant}
      data-testid={testId}
    >
      {heading && <div slot="heading">{heading}</div>}
      {actions && <div slot="actions">{actions}</div>}
      {children}
    </goa-modal>
  );
};

export default GoAModal;
