interface InputBoxProps {
  type: string;
  placeholder: string;
  size: "fit" | "lg";
  reference?: React.RefObject<HTMLInputElement | null>
}

export const InputBox = (props: InputBoxProps) => {
  const sizeStyles = {
    fit: "",
    lg: "w-62",
  };

  const defaultStyles = "outline-none px-3 py-1.5 rounded-lg border border-gray-200";

  return (
    <input
      ref={props.reference}
      type={props.type}
      placeholder={props.placeholder}
      className={`${defaultStyles} ${sizeStyles[props.size]}`}
    />
  );
};
