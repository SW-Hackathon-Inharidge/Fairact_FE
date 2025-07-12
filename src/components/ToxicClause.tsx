type ToxicClauseProps = {
    reason: string;
    description: string;
    confirmText: string;
    checked: boolean;
    onCheck: (checked: boolean) => void;
    hideCheckbox?: boolean;
  };
  
  export default function ToxicClause({
    reason,
    description,
    confirmText,
    checked,
    onCheck,
    hideCheckbox = false,
  }: ToxicClauseProps) {
    return (
      <div className="w-full max-w-xs inline-flex flex-col justify-start items-start gap-3 px-4">
        <div className="self-stretch px-5 py-6 bg-white rounded-2xl outline outline-2 outline-offset-[-2px] outline-neutral-400 flex flex-col justify-start items-start gap-3 min-h-[120px]">
          <div className="self-stretch text-black text-lg font-bold font-inter leading-loose truncate">
            {reason}
          </div>
          <div className="self-stretch text-blue-600 text-lg font-normal font-inter leading-loose">
            {description}
          </div>
        </div>
  
        {!hideCheckbox && (
          <div className="flex justify-start items-center gap-2 px-1 whitespace-nowrap">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => onCheck(e.target.checked)}
              className="w-6 h-6 rounded-md outline outline-2 outline-offset-[-2px] outline-neutral-400 bg-white
                checked:bg-pink-500 checked:outline-none"
            />
            <label className="text-white text-sm font-normal font-inter leading-tight truncate max-w-xs cursor-pointer">
              {confirmText}
            </label>
          </div>
        )}
      </div>
    );
  }
  