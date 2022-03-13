import '../styles/globals.css';
import type { AppProps, NextWebVitalsMetric } from 'next/app';
import { useCallback, useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    metricQueue: object[];
    reportMetrics: (...data: object[]) => Promise<boolean>;
  }
}

const VITALS_ENABLED = process.env.NEXT_PUBLIC_VITALS === 'true';

const useMetricReporter = () => {
  const queueReporter = useCallback((_, data: object) => {
    if (!window.metricQueue) window.metricQueue = [];
    window.metricQueue.push(data);
    return Promise.resolve(true);
  }, []);

  const beaconReporter = useCallback(
    (url: string, data: object) => Promise.resolve(navigator.sendBeacon(url, JSON.stringify(data))),
    [],
  );
  const fetchReporter = useCallback(
    (url: string, data: object) =>
      fetch(url, { body: JSON.stringify(data), method: 'POST', keepalive: true })
        .then(() => true)
        .catch(() => false),
    [],
  );

  const [reporter, setMetricReporter] = useState<(url: string, ...data: object[]) => Promise<boolean>>(
    () => queueReporter,
  );

  const reportMetrics = useCallback(
    (...data: object[]) => (data.length === 1 ? reporter('/api/vital', data[0]) : reporter('/api/vitals', data)),
    [reporter],
  );
  const clearQueue = useCallback(async () => {
    if (!window.metricQueue) window.metricQueue = [];
    if (!window.metricQueue.length) return;
    reporter === queueReporter
      ? fetchReporter('/api/vitals', window.metricQueue)
      : reportMetrics(...window.metricQueue);
    window.metricQueue = [];
  }, [queueReporter, fetchReporter, reportMetrics, reporter]);

  useEffect(() => {
    if (!VITALS_ENABLED || reporter !== queueReporter) return;

    const ID = (Date.now() + Math.random()).toString();
    let timeout;
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/vitalc', ID);
      timeout = setTimeout(
        () =>
          fetch('/api/vitalc', { body: ID, method: 'POST' })
            .then(r => r.text())
            .then(t => t == '1')
            .catch(() => false)
            .then(beaconWorking => {
              setMetricReporter(() => (beaconWorking ? beaconReporter : fetchReporter));
              clearQueue();
            }),
        5000,
      );
    } else {
      setMetricReporter(fetchReporter);
      clearQueue();
    }
    return () => {
      if (timeout) clearTimeout(timeout);
      clearQueue();
    };
  }, [queueReporter, beaconReporter, fetchReporter, clearQueue, reporter]);

  return reportMetrics;
};

function MyApp({ Component, pageProps }: AppProps) {
  const reportMetrics = useMetricReporter();
  useEffect(() => {
    window.reportMetrics = reportMetrics;
  }, [reportMetrics]);
  return <Component {...pageProps} reportMetrics={reportMetrics} />;
}

export function reportWebVitals(metric: NextWebVitalsMetric & { pathname: string }) {
  if (!VITALS_ENABLED) return;

  metric.pathname = window.location.pathname;
  if (window.reportMetrics) return window.reportMetrics(metric);

  if (!window.metricQueue) window.metricQueue = [];
  return window.metricQueue.push(metric);
}

export default MyApp;
