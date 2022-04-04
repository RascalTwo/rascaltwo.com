import { CSSProperties, useMemo } from 'react';

import styles from './LCDCounter.module.css';

// https://www.joshwcomeau.com/

const DIGIT_SEGMENTS = {
  0: [true, true, true, true, true, true, false],
  1: [false, true, true, false, false, false, false],
  2: [true, true, false, true, true, false, true],
  3: [true, true, true, true, false, false, true],
  4: [false, true, true, false, false, true, true],
  5: [true, false, true, true, false, true, true],
  6: [true, false, true, true, true, true, true],
  7: [true, true, true, false, false, false, false],
  8: [true, true, true, true, true, true, true],
  9: [true, true, true, true, false, true, true],
  ' ': [false, false, false, false, false, false, false],
};

type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | ' ';

const SEGMENT_STYLES: CSSProperties[] = [
  { top: '0px', left: '1px' },
  { top: '1px', left: '12px', transform: 'rotate(90deg)', transformOrigin: 'left top 0px' },
  { top: '11px', left: '12px', transform: 'rotate(90deg)', transformOrigin: 'left top 0px' },
  { bottom: '0px', left: '1px' },
  { top: '11px', left: '2px', transform: 'rotate(90deg)', transformOrigin: 'left top 0px' },
  { top: '1px', left: '2px', transform: 'rotate(90deg)', transformOrigin: 'left top 0px' },
  { top: '10px', left: '1px' },
];

function LCDDigit({ digit }: { digit: Digit }) {
  const onSegments = useMemo(() => DIGIT_SEGMENTS[digit], [digit]);

  return (
    <div className={styles.digit}>
      {SEGMENT_STYLES.map((segment, i) => (
        <div key={i} style={segment}>
          <svg>
            <path fill="#315324" d="M 0.5 1 L 1.5 0 L 8.5 0 L 9.5 1 L 8.5 2 L 1.5 2"></path>
            <path
              fill="#76FF03"
              style={{ opacity: +onSegments[i] }}
              d="M 0.5 1 L 1.5 0 L 8.5 0 L 9.5 1 L 8.5 2 L 1.5 2"
            ></path>
          </svg>
        </div>
      ))}
    </div>
  );
}

interface LCDCounterProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  number: number;
}

export default function LCDCounter({ number, ...props }: LCDCounterProps) {
  const digits = useMemo(
    () => [...`${number}`.padStart(6, ' ')].map(char => (char === ' ' ? char : (+char as Digit))),
    [number],
  );
  return (
    <div className={styles.counter} {...props}>
      <div>
        <div>
          <div className={styles.digitsWrapper}>
            {digits.map((digit, i) => (
              <LCDDigit key={i} digit={digit} />
            ))}
          </div>
          <div className={styles.greenGlow}></div>
        </div>
      </div>
      <img
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGIAAAAmCAYAAAA/bE50AAABMElEQVRoge3RsU7CUBiG4V6fhMsQcNCRSY01xA11shMlLHViO9R0OH9KIqFSVk3URSKJJnXoYNj+xMGJhBCWHr7he5P3Ch7PTD7ETBfK9/fJ1UA8M12oyQoxT4Vy999GmdSavv5DzAoNk0/pJ0vl7h4+FnIexLoG0U+W2r7LpR3MlVd/lH6JyUvdDBHMtd64lnqrq7y6L3uppC8r3Q5x1FWPVVr48K6EAIgQIBECJEKARAiQCAESIUAiBEiEAIkQIBECJEKARAiQCAESIUAiBEiEAIkQIBECJEKARAiQCAESIUAiBEiEAIkQIBECpJ0gOr2xDeM35VX+ardCRONvK88r5S7+tRshhpMfa/JSubtHs9KuQdzcZ/YsGCl3/2kQ21rTV++4M7AHDV/5Hj+8sH9RY8+UQVRQ7wAAAABJRU5ErkJggg=="
        alt=""
      />
    </div>
  );
}
