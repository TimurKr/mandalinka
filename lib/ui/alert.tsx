import { ReactComponentElement } from "react";

import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  NoSymbolIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function Alert({
  children,
  variant,
  show,
  onClose,
  className,
  icon = true,
}: {
  children: React.ReactNode;
  variant: "danger" | "warning" | "success" | "black" | "primary" | "secondary";
  show?: boolean;
  onClose?: () => void;
  className?: string;
  icon?: boolean | JSX.Element;
}): ReactComponentElement<any> {
  if (show === false) return <></>;
  if (show === undefined && !children) return <></>;

  return (
    <div
      className={`${className} m-2 flex items-center gap-2 rounded-xl border p-2 ${
        variant === "danger"
          ? "border-red-600 text-red-600"
          : variant === "warning"
          ? "border-yellow-600 text-yellow-600"
          : variant === "success"
          ? "border-green-600 text-green-600"
          : variant === "black"
          ? "border-gray-600 text-gray-600"
          : variant === "primary"
          ? "border-primary-600 text-primary"
          : variant === "secondary"
          ? "border-secondary-600 text-secondary"
          : ""
      }`}
      role="alert"
    >
      {icon == true ? (
        variant === "danger" ? (
          <ExclamationCircleIcon className="h-6 w-6" aria-hidden="true" />
        ) : variant === "warning" ? (
          <ExclamationTriangleIcon className="h-6 w-6" aria-hidden="true" />
        ) : variant === "success" ? (
          <CheckCircleIcon className="h-6 w-6" aria-hidden="true" />
        ) : (
          <NoSymbolIcon className="h-6 w-6" aria-hidden="true" />
        )
      ) : icon ? (
        icon
      ) : (
        ""
      )}
      <span className="grow font-medium">{children}</span>
      {onClose && (
        <button
          className="rounded-md p-0.5 hover:bg-black/5"
          onClick={onClose}
          aria-label="Close"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
