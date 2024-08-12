"use client";

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  size?: "small" | "large";
}

export const SecondaryButton = ({
  children,
  onClick,
  size = "small",
}: ButtonProps) => {
  return (
    <button
      className={`border-2 border-slate-400 font-medium hover:border-black transition-all ${size === "small" ? "px-6 py-1 text-sm rounded-3xl" : "px-12 py-3 text-lg rounded-full"}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
