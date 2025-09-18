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
      {...props}
    />
  );
}

export default InputBox;
