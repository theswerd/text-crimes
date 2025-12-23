import { ReactNode } from 'react';

export function InlineMark({ children }: { children: ReactNode }) {
  return (
    <span className="inline bg-gray-200 rounded-sm px-1.25 pt-0.5 pb-0.5">
      {children}
    </span>
  );
}
