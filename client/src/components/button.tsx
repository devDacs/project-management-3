import { LucideIcon } from "lucide-react";
import React from "react";

type Props = {
  label?: string | null;
  icon?: LucideIcon | null;
  iconClassname?: string | null;
  withLabel?: boolean;
  onClick: () => void;
};

const Button = ({
  label,
  icon: Icon,
  iconClassname,
  withLabel = false,
  onClick,
}: Props) => {
  return (
    <button
      className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
      onClick={onClick}
    >
      {!withLabel
        ? label
        : label &&
          Icon && (
            <>
              <Icon className={iconClassname ?? ""} /> {label}
            </>
          )}
    </button>
  );
};

export default Button;
