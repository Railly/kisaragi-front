const styles = {
  base: "transition rounded-lg",
  secondary:
    "bg-blue-500 text-white shadow-lg hover:shadow-blue-800/50 shadow-blue-500/40  hover:bg-blue-700",
  outline_primary:
    "border-2 border-sky-500 text-sky-500 shadow-lg hover:shadow-sky-700/20 hover:bg-sky-100 shadow-sky-500/20",
  primary:
    "bg-emerald-500 text-white shadow-lg hover:shadow-emerald-800/50 shadow-emerald-500/40 hover:bg-emerald-700",
  tertiary:
    "bg-slate-600 text-white shadow-lg hover:shadow-slate-800/50 shadow-slate-600/40 hover:bg-slate-700",
  danger:
    "bg-rose-500 text-white shadow-lg hover:shadow-rose-800/50 shadow-rose-500/40 hover:bg-rose-700",
};

const sizing = {
  small: "text-sm font-medium py-1 px-2",
  medium: "text-base font-semibold py-2 px-4",
  large: "text-lg font-bold py-3 px-6",
};

export default function Button({
  children,
  className,
  disabled = false,
  type = "submit",
  variant = "primary",
  size = "medium",
  onClick,
  ...rest
}) {
  return (
    <button
      className={`${styles.base} ${sizing[size]} ${styles[variant]} ${className}`}
      disabled={disabled}
      type={type}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}
