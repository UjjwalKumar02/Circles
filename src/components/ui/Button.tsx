interface ButtonProps {
  variant: "primary" | "secondary";
  size: "sm" | "md" | "lg";
  text: string;
  onClick: () => void;
  fullWidth?: boolean;
  disabled?: boolean;
}

export default function Button(props: ButtonProps) {
  const variantStyles = {
    primary: "bg-blue-500 text-white hover:bg-blue-400",
    secondary: "border border-gray-300 hover:bg-gray-50 text-gray-700",
  };
  const sizeStyles = {
    sm: "px-6 py-1.5 text-xs",
    md: "px-8 py-1.5 text-sm",
    lg: "px-10 py-2",
  };
  const defaultStyles = "w-fit font-medium rounded-lg cursor-pointer";

  const disabledStyles = "bg-gray-300 text-gray-800";

  return (
    <button
      onClick={props.onClick}
      className={`${defaultStyles} ${variantStyles[props.variant]} ${
        sizeStyles[props.size]
      } ${props.fullWidth ? "w-full" : ""} ${props.disabled && disabledStyles}`}
      disabled={props.disabled}
    >
      {props.text}
    </button>
  );
}
