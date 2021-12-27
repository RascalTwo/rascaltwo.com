import { useCallback, useEffect } from 'react';
import { usePortal } from '../../helpers';

import styles from './Modal.module.css'

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ onClose, children }: ModalProps) {
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      onClose();
      e.stopImmediatePropagation();
      e.preventDefault();
    }
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [onClose]);

  return usePortal('#modal', <div>
    <button title="Close" className={styles.closeButton} onClick={onClose}>X</button>
    {children}
  </div>, useCallback(modal => {
    if (!modal) return;

    document.body.style.width = document.body.clientWidth + 'px';
    document.body.style.overflow = 'hidden';

    modal.className = styles.modal;


    const oldFocus = document.activeElement as unknown as HTMLOrSVGElement;

    const onClick = (e: Event) => {
      if (e.target !== modal) return;
      onClose();
      e.stopPropagation();
      e.stopImmediatePropagation();
      e.preventDefault();
    }

    modal.addEventListener('click', onClick);

    modal.querySelector('button')!.focus();
    return () => {

      document.body.style.overflow = 'auto';
      document.body.style.width = 'auto';

      modal.removeAttribute('class');

      oldFocus.focus();

      modal.removeEventListener('click', onClick);
    }
  }, [onClose]));
}
