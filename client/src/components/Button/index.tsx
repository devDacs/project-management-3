import React from "react";

type Props = {
  label: string;
  onClick: () => void;
};

const Button = ({ label, onClick }: Props) => {
  return (
    <button
      className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button;
