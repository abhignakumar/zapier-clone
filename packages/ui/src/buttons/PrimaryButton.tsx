"use client";

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  size?: "small" | "large";
}

export const PrimaryButton = ({
  children,
  onClick,
  size = "small",
}: ButtonProps) => {
  return (
    <button
      className={`bg-[#ff4f00] border-2 border-[#ff4f00] text-gray-50 font-medium hover:bg-[#be643a] hover:border-[#be643a] hover:shadow-lg transition-all ${size === "small" ? "px-6 py-1 text-sm rounded-3xl" : "px-12 py-3 text-lg rounded-full"}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
