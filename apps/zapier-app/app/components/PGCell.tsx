import { MouseEvent as MouseEventReact } from "react";

export const PGCell = ({
  children,
  onClick,
  deleteActionOnClick,
  closeable,
  isSelected,
}: {
  children: React.ReactNode;
  onClick: () => void;
  deleteActionOnClick?: (
    e: MouseEventReact<HTMLDivElement, MouseEvent>
  ) => void;
  closeable: boolean;
  isSelected: boolean;
}) => {
  return (
    <div
      className={`relative border-2 border-slate-400 p-4 w-64 flex justify-center rounded-lg cursor-pointer hover:shadow-md transition-all ${isSelected ? "bg-zinc-200 hover:bg-zinc-100 border-solid" : "bg-zinc-100 hover:bg-zinc-50 border-dashed"}`}
      onClick={onClick}
    >
      <div className="w-full">{children}</div>
      {closeable && (
        <div
          className="absolute top-[-10px] right-[-10px] text-red-600 bg-white rounded-full"
          onClick={deleteActionOnClick}
        >
          <CloseIcon />
        </div>
      )}
    </div>
  );
};

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-7"
    >
      <path
        fillRule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
