interface InputBoxProps {
  type: string;
  placeholder?: string;
  size: "sm" | "fit" | "lg";
  reference?: React.RefObject<HTMLInputElement | null>;
  disabled?: boolean;
  value?: string;
  fullWidth?: boolean;
}

export const InputBox = (props: InputBoxProps) => {
  const sizeStyles = {
    sm: "text-gray-800 bg-50 text-sm",
    fit: "",
    lg: "w-62",
  };

  const defaultStyles = "outline-none px-3 py-1.5 rounded-lg border border-gray-200";

  return (
    <input
      ref={props.reference}
      type={props.type}
      placeholder={props.placeholder}
      className={`${defaultStyles} ${sizeStyles[props.size]} ${
        props.fullWidth && "w-62"
      }`}
      value={props.value}
      disabled={props.disabled}
    />
  );
};
