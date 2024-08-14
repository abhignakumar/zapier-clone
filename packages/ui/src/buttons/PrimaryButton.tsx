"use client";

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  size?: "small" | "large";
  variant?: "orange" | "purple";
}

export const PrimaryButton = ({
  children,
  onClick,
  size = "small",
  variant = "orange",
}: ButtonProps) => {
  return (
    <button
      className={`border-2 text-gray-50 font-medium hover:shadow-lg transition-all ${size === "small" ? "px-6 py-1 text-sm rounded-3xl" : "px-12 py-3 text-lg rounded-full"} ${variant === "orange" ? "bg-[#ff4f00] border-[#ff4f00] hover:bg-[#be643a] hover:border-[#be643a]" : "bg-[#4f419c] border-[#4f419c] hover:bg-[#3f366d] hover:border-[#3f366d]"}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
