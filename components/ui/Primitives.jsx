export function Badge({ children, variant = "green" }) {
  const styles = {
    green: "bg-green-100 text-green-800 border border-green-200",
    blue: "bg-blue-100 text-blue-800 border border-blue-200",
    gold: "bg-amber-100 text-amber-800 border border-amber-200",
    red: "bg-red-100 text-red-800 border border-red-200",
    gray: "bg-gray-100 text-gray-700 border border-gray-200",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${styles[variant]}`}>
      {children}
    </span>
  );
}

export function Avatar({ initials, color = "#1B4F8A", size = "md" }) {
  const sizes = { sm: "w-9 h-9 text-sm", md: "w-12 h-12 text-base", lg: "w-16 h-16 text-xl" };
  return (
    <div
      className={`${sizes[size]} rounded-xl flex items-center justify-center font-bold text-white flex-shrink-0`}
      style={{ background: color }}
    >
      {initials}
    </div>
  );
}

export function StarRating({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < count ? "text-amber-400" : "text-gray-300"}>
          ★
        </span>
      ))}
    </div>
  );
}

export function Spinner({ size = 5 }) {
  return (
    <svg
      className={`animate-spin h-${size} w-${size} text-current`}
      style={{ height: `${size * 4}px`, width: `${size * 4}px` }}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

export function FieldError({ message }) {
  if (!message) return null;
  return <p className="text-xs text-red-600 mt-1 font-medium">{message}</p>;
}
