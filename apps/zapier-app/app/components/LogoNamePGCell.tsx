export const LogoNamePGCell = ({
  name,
  image,
}: {
  name: string;
  image: string;
}) => {
  return (
    <div className="flex">
      <div className="w-[40px] flex items-center bg-[#fbddd2] rounded-lg border border-slate-400">
        <div className="w-full flex justify-center h-1/2">
          <img src={image} alt={name} className="w-3/5 rounded-full" />
        </div>
      </div>
      <div className="ml-3 font-semibold text-slate-800">{name}</div>
    </div>
  );
};
