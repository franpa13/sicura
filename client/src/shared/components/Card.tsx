import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  footer?: ReactNode;
  children: ReactNode;
}

export function Card({ title, footer, children }: CardProps) {
  return (
    <article className="card">
      {title ? <h3 className="card__title">{title}</h3> : null}
      <div className="card__body">{children}</div>
      {footer ? <div className="card__footer">{footer}</div> : null}
    </article>
  );
}
