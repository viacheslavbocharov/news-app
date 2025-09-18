import type { ButtonHTMLAttributes } from "react";

export default function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className = "", ...rest } = props;
  return (
    <button
      className={`rounded-lg px-4 py-2 text-sm font-medium
  bg-gray-900 text-white 
  dark:bg-gray-100 dark:text-gray-900
  hover:opacity-90 active:opacity-80 
  cursor-pointer disabled:opacity-50 
  ${className}`}
      {...rest}
    />
  );
}
