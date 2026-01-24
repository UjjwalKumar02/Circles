export function ButtonV2({
  variant,
  size,
  children,
  className,
  onClick,
  loading,
  disabled,
}: {
  variant: "primary" | "secondary";
  size: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
}) {
  const variantStyles = {
    primary: "bg-black text-gray-100 hover:bg-gray-900",
    secondary: "bg-white border border-gray-200 hover:border-gray-300",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-7 py-3 text-sm",
  };

  const defaultStyles = "font-medium rounded-xl cursor-pointer shadow";

  return (
    <button
      onClick={onClick}
      className={`${className} ${variantStyles[variant]} ${sizeStyles[size]} ${defaultStyles}`}
      disabled={disabled}
    >
      {loading ? "loading..." : children}
    </button>
  );
}
