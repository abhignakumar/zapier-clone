"use client";

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
}

export const LinkButton = ({ children, onClick }: ButtonProps) => {
  return (
    <button
      className={`rounded text-slate-600 text-sm hover:bg-[#f7efe2] transition-all px-3 py-2`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
