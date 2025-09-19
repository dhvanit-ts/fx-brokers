import React from "react";

function InputBox({
  value,
  setValue,
  ...props
}: {
  value: string;
  setValue: (value: string) => void;
  placeholder?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="text"
      value={value ?? ""}
      onChange={(e) => setValue(e.target.value)}
      className="hover:border-zinc-400 rounded-md px-1 transition-all border-transparent border-[1.5px]"
      {...props}
    />
  );
}

export default InputBox;
