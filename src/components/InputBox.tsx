interface InputBoxProps {
  type: string;
  placeholder?: string;
  size: "sm" | "md" | "none";
  reference?: React.RefObject<HTMLInputElement | null>;
  disabled?: boolean;
  value?: string;
  fullWidth?: boolean;
  borderNone?: boolean;
}

export const InputBox = (props: InputBoxProps) => {
  const sizeStyles = {
    none: "",
    sm: "text-sm",
    md: "w-62",
  };

  const defaultStyles =
    "outline-none px-3 py-1.5 rounded-lg border border-gray-200 text-gray-800 ";

  return (
    <input
      ref={props.reference}
      type={props.type}
      placeholder={props.placeholder}
      className={`${defaultStyles} ${sizeStyles[props.size]} ${
        props.fullWidth && "w-full"
      } ${props.borderNone && "border-none"}`}
      defaultValue={props.value}
      disabled={props.disabled}
    />
  );
};
