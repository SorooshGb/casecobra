'use client';

import { useEffect, useRef, useState, useTransition } from 'react';

export default function useServerAction<T>(serverAction: () => T): [Awaited<T> | null, boolean] {
  const [data, setData] = useState<Awaited<T> | null>(null);
  const [isPending, startTransition] = useTransition();

  // To make sure server action is only called once
  const actionCalled = useRef(false);

  useEffect(() => {
    if (actionCalled.current) return;
    actionCalled.current = true;

    startTransition(async () => {
      const data = await serverAction();
      setData(data);
    });
  }, [serverAction]);

  return [data, isPending];
}
