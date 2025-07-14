type ToxicClauseProps = {
  text?: string;
  reason: string;
  suggestion: string;
  confirmText: string;
  checked: boolean;
  onCheck: (checked: boolean) => void;
  hideCheckbox?: boolean;
};

export default function ToxicClause({
  text,
  reason,
  suggestion,
  confirmText,
  checked,
  onCheck,
  hideCheckbox = false,
}: ToxicClauseProps) {
  return (
    <div className="w-full max-w-xs inline-flex flex-col justify-start items-start gap-3">
      <div className="self-stretch px-5 py-6 bg-white rounded-2xl outline outline-2 outline-offset-[-2px] outline-neutral-400 flex flex-col justify-start items-start gap-3 min-h-[120px]">
        {text !== null && (
          <div className="self-stretch text-black text-lg font-bold font-inter leading-loose truncate">
            {text}
          </div>
        )}
        <div className="self-stretch text-blue-600 text-lg font-normal font-inter leading-loose">
          {reason}
        </div>
        <div className="self-stretch border-t-2 border-gray-300 my-2" />
        <div className="self-stretch text-gray-600 text-lg font-normal font-inter leading-loose">
          제안: <br/>
          {suggestion}
        </div>
      </div>

      {!hideCheckbox && (
        <div className="flex flex-col items-start gap-1 px-2 py-2 rounded-md bg-pink-50 max-w-[300px]">
          <label className="flex items-center gap-2 cursor-pointer w-full">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => onCheck(e.target.checked)}
              className={`
          w-6 h-6 rounded-md
          outline outline-2 outline-offset-[-2px] outline-neutral-600
          bg-white
          cursor-pointer
          transition-all duration-200
          checked:bg-pink-600 checked:outline-pink-600 checked:shadow-lg
          hover:outline-pink-500
          flex-shrink-0
        `}
            />
            <span className="text-pink-600 text-sm font-semibold font-inter leading-tight truncate max-w-full">
              {confirmText}
            </span>
          </label>
        </div>
      )}
    </div>
  );
}
