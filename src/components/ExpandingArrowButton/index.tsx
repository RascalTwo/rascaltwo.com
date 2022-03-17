import React from 'react';
import styles from './ExpandingArrowButton.module.css';

// https://cssbuttons.io/detail/cssbuttons-io/massive-mayfly-74

export default function ExpandingArrowButton({
  children,
  ...props
}: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
  return (
    <button className={styles.learnMore} {...props}>
      <span className={styles.circle} aria-hidden="true">
        <span className={`${styles.icon} ${styles.arrow}`}></span>
      </span>
      <span className={styles.buttonText}>{children}</span>
    </button>
  );
}
