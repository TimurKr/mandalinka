import Link from "next/link";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant: "primary" | "secondary" | "black" | "danger" | "warning" | "success";
  dark?: boolean;
  className?: string;
}

const Button = (props: Props) => {
  const { style, dark, className = "", href, children, ...buttonProps } = props;

  if (href && (buttonProps.onClick || buttonProps.type)) {
    throw new Error("Button cannot have href and onClick or type");
  } else if (!href && !buttonProps.onClick && !buttonProps.type) {
    throw new Error("Button must have href, onClick or type");
  }

  const buttonClassName = `${className} btn ${
    props.variant === "primary"
      ? props.dark
        ? "btn-primary-dark"
        : "btn-primary"
      : props.variant === "secondary"
      ? props.dark
        ? "btn-secondary-dark"
        : "btn-secondary"
      : props.variant === "black"
      ? props.dark
        ? "btn-black-dark"
        : "btn-black"
      : props.variant === "danger"
      ? props.dark
        ? "btn-danger-dark"
        : "btn-danger"
      : props.variant === "warning"
      ? props.dark
        ? "btn-warning-dark"
        : "btn-warning"
      : props.variant === "success"
      ? props.dark
        ? "btn-success-dark"
        : "btn-success"
      : ""
  }`;

  if (href && !buttonProps.disabled) {
    return (
      <Link href={href} className={buttonClassName}>
        {children}
      </Link>
    );
  } else {
    return (
      // Spread all props to the button, but override the className
      <button {...buttonProps} className={buttonClassName}>
        {children}
      </button>
    );
  }
};

export default Button;
