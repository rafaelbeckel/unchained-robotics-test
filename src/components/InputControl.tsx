import { css } from "../../styled-system/css";

interface InputControlProps {
  label: string;
  id: string;
  type?: string;
  value?: string | number;
  step?: number;
  disabled?: boolean;
  onChange: (e: Event) => void;
  minWidthLabel?: string;
  maxWidthLabel?: string;
  minWidthInput?: string;
  maxWidthInput?: string;
}

const DEFAULT_LABEL_MAX_WIDTH = "65%";
const DEFAULT_INPUT_MAX_WIDTH = "35%";
const DEFAULT_MIN_WIDTH = "0";

export function InputControl({
  label,
  id,
  type = "number",
  value,
  step,
  disabled,
  onChange,
  minWidthLabel = DEFAULT_MIN_WIDTH,
  maxWidthLabel = DEFAULT_LABEL_MAX_WIDTH,
  minWidthInput = DEFAULT_MIN_WIDTH,
  maxWidthInput = DEFAULT_INPUT_MAX_WIDTH,
}: InputControlProps) {
  return (
    <div
      class={css({
        mb: 2,
        display: "flex",
        alignItems: "center",
        width: "100%",
        maxWidth: "100%",
        gap: 1,
      })}
    >
      <label
        htmlFor={id}
        class={css({
          minWidth: minWidthLabel,
          maxWidth: maxWidthLabel,
          flex: 1,
          fontWeight: "medium",
          fontSize: "sm",
          color: "token(colors.text.secondary)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        })}
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        step={step}
        onInput={onChange}
        disabled={disabled}
        class={css({
          minWidth: minWidthInput,
          maxWidth: maxWidthInput,
          flex: 1,
          fontSize: "sm",
          ml: 1,
          px: 1,
          py: 1,
          border: "1px solid token(colors.border.DEFAULT)",
          borderRadius: "sm",
          bg: "token(colors.bg.card)",
          color: "token(colors.text.DEFAULT)",
          _focus: {
            border: "1px solid token(colors.border.focus)",
            outline: "none",
          },
          transition: "border 0.2s",
        })}
      />
    </div>
  );
}
