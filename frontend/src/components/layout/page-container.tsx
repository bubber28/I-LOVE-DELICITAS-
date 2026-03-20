import type { PropsWithChildren } from 'react';

export function PageContainer({ children }: PropsWithChildren) {
  return <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">{children}</div>;
}
