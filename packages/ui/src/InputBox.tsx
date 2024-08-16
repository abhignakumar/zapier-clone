export const InputBox = ({
  label,
  placeholder,
  onChange,
  type = "text",
  inputId,
  inputValue,
}: {
  label: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  inputId?: string;
  inputValue?: string;
}) => {
  return (
    <div>
      <div className="py-1 font-semibold text-slate-700">{label}</div>
      <div>
        <input
          id={inputId}
          type={type}
          placeholder={placeholder}
          onChange={onChange}
          className="w-full p-2 mb-1 rounded-lg"
          value={inputValue}
        />
      </div>
    </div>
  );
};
