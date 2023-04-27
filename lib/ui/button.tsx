'use client';

import type { Route } from 'next';
import Link from 'next/link';

export default function Button<T extends string>(
  props: Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'href'> & {
    href?: Route<T> | URL;
    variant:
      | 'primary'
      | 'secondary'
      | 'black'
      | 'danger'
      | 'warning'
      | 'success';
    dark?: boolean;
  }
) {
  if (props.href && (props.onClick || props.type)) {
    throw new Error('Button cannot have href and onClick or type');
  } else if (!props.href && !props.onClick && !props.type) {
    throw new Error('Button must have href, onClick or type');
  }

  const buttonClassName = `${props.className} btn ${
    props.variant === 'primary'
      ? props.dark
        ? 'btn-primary-dark'
        : 'btn-primary'
      : props.variant === 'secondary'
      ? props.dark
        ? 'btn-secondary-dark'
        : 'btn-secondary'
      : props.variant === 'black'
      ? props.dark
        ? 'btn-black-dark'
        : 'btn-black'
      : props.variant === 'danger'
      ? props.dark
        ? 'btn-danger-dark'
        : 'btn-danger'
      : props.variant === 'warning'
      ? props.dark
        ? 'btn-warning-dark'
        : 'btn-warning'
      : props.variant === 'success'
      ? props.dark
        ? 'btn-success-dark'
        : 'btn-success'
      : ''
  }`;

  if (props.href && !props.disabled) {
    return (
      <Link href={props.href} className={buttonClassName}>
        {props.children}
      </Link>
    );
  } else {
    return (
      // Spread all props to the button, but override the className
      <button {...props} className={buttonClassName}>
        {props.children}
      </button>
    );
  }
}
