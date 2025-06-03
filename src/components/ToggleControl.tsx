import { css } from "../../styled-system/css";

interface ToggleControlProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
}

export function ToggleControl({
  label,
  checked,
  onChange,
  id,
}: ToggleControlProps) {
  return (
    <label
      htmlFor={id}
      class={css({
        display: "flex",
        alignItems: "center",
        mb: 1,
        fontWeight: "medium",
        fontSize: "sm",
        color: "token(colors.text.secondary)",
        cursor: "pointer",
      })}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onInput={(e: any) => onChange(e.target.checked)}
        class={css({ mr: 1 })}
      />
      {label}
    </label>
  );
}
