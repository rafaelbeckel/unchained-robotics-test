import { css } from "../../styled-system/css";
import { InputControl } from "./InputControl";

interface ObjectPropertiesProps {
  selected: any;
  onPosChange: (axis: string, e: Event) => void;
}

export function ObjectProperties({
  selected,
  onPosChange,
}: ObjectPropertiesProps) {
  return (
    <div
      id="object-properties-container"
      class={css({
        p: 2,
        bg: "token(colors.bg.card)",
        borderRadius: "md",
        boxShadow: "card",
      })}
    >
      <h3
        class={css({
          fontWeight: "extrabold",
          fontSize: "xl",
          mb: 2,
          color: "token(colors.text.accent)",
          letterSpacing: "wide",
        })}
      >
        Properties
      </h3>
      <div
        id="selected-object-name"
        class={css({
          mb: 2,
          fontWeight: "bold",
          fontSize: "lg",
          color: "token(colors.text.accent)",
        })}
      >
        {selected ? selected.name : "No object selected"}
      </div>
      {["x", "y", "z"].map((axis) => (
        <InputControl
          key={axis}
          label={`Position ${axis.toUpperCase()}:`}
          id={`pos-${axis}`}
          type="number"
          step={0.1}
          onChange={(e: Event) => onPosChange(axis, e)}
          disabled={!selected}
        />
      ))}
    </div>
  );
}
