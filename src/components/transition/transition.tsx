import { AnimatePresence, usePresence } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';

export type TransitionStatus = 'entering' | 'entered' | 'exiting' | 'exited';

export type TransitionRenderProps = {
  visible: boolean;
  status: TransitionStatus;
  nodeRef: RefObject<HTMLElement | null>;
};

type Timeout = number | { enter: number; exit: number };

type TransitionProps = {
  children: (props: TransitionRenderProps) => ReactNode;
  in?: boolean;
  unmount?: boolean;
  initial?: boolean;
  timeout?: Timeout;
  onEnter?: () => void;
  onEntered?: () => void;
  onExit?: () => void;
  onExited?: () => void;
  nodeRef?: RefObject<HTMLElement | null>;
};

/**
 * A minimal `react-transition-group` built on Framer Motion's presence
 * primitives. It hands children a `status` string to drive plain CSS
 * transitions, which keeps the choreography in the stylesheet where the rest
 * of the timing tokens live.
 */
export const Transition = ({
  children,
  in: show,
  unmount,
  initial = true,
  ...props
}: TransitionProps) => {
  const enterTimeout = useRef<number>();
  const exitTimeout = useRef<number>();

  useEffect(() => {
    if (show) {
      window.clearTimeout(exitTimeout.current);
    } else {
      window.clearTimeout(enterTimeout.current);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {(show || !unmount) && (
        <TransitionContent
          enterTimeout={enterTimeout}
          exitTimeout={exitTimeout}
          in={show}
          initial={initial}
          {...props}
        >
          {children}
        </TransitionContent>
      )}
    </AnimatePresence>
  );
};

type TransitionContentProps = Omit<TransitionProps, 'unmount'> & {
  enterTimeout: React.MutableRefObject<number | undefined>;
  exitTimeout: React.MutableRefObject<number | undefined>;
};

const TransitionContent = ({
  children,
  timeout = 0,
  enterTimeout,
  exitTimeout,
  onEnter,
  onEntered,
  onExit,
  onExited,
  initial,
  nodeRef: defaultNodeRef,
  in: show,
}: TransitionContentProps) => {
  const [status, setStatus] = useState<TransitionStatus>(initial ? 'exited' : 'entered');
  const [isPresent, safeToRemove] = usePresence();
  const [hasEntered, setHasEntered] = useState(initial ? false : true);
  const splitTimeout = typeof timeout === 'object';
  const internalNodeRef = useRef<HTMLElement>(null);
  const nodeRef = defaultNodeRef || internalNodeRef;
  const visible = hasEntered && show ? isPresent : false;

  useEffect(() => {
    if (hasEntered || !show) return;

    const actualTimeout = splitTimeout ? timeout.enter : timeout;

    window.clearTimeout(enterTimeout.current);
    window.clearTimeout(exitTimeout.current);

    setHasEntered(true);
    setStatus('entering');
    onEnter?.();

    // Force a reflow so the browser paints the `exited` styles before the
    // `entering` class lands, otherwise the transition is skipped.
    void nodeRef.current?.offsetHeight;

    enterTimeout.current = window.setTimeout(() => {
      setStatus('entered');
      onEntered?.();
    }, actualTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onEnter, onEntered, timeout, status, show]);

  useEffect(() => {
    if (isPresent && show) return;

    const actualTimeout = splitTimeout ? timeout.exit : timeout;

    window.clearTimeout(enterTimeout.current);
    window.clearTimeout(exitTimeout.current);

    setStatus('exiting');
    onExit?.();

    void nodeRef.current?.offsetHeight;

    exitTimeout.current = window.setTimeout(() => {
      setStatus('exited');
      safeToRemove?.();
      onExited?.();
    }, actualTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPresent, onExit, safeToRemove, timeout, onExited, show]);

  return <>{children({ visible, status, nodeRef })}</>;
};
