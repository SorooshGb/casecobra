import { NextResponse } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ApiData<T extends (...args: any) => Promise<NextResponse<any>>> =
  Awaited<ReturnType<T>> extends NextResponse<infer U> ? U : never;
