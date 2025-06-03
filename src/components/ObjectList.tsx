import { css } from "../../styled-system/css";

interface ObjectListProps {
  objects: any[];
  selected: any;
  onSelect: (obj: any) => void;
}

export function ObjectList({ objects, selected, onSelect }: ObjectListProps) {
  return (
    <div
      id="object-list-container"
      class={css({
        mb: 2,
        p: 2,
        bg: "token(colors.bg.card)",
        borderRadius: "md",
        boxShadow: "card",
      })}
    >
      <h3
        class={css({
          fontWeight: "bold",
          fontSize: "md",
          mb: 2,
          color: "token(colors.text.accent)",
          letterSpacing: "wide",
        })}
      >
        Scene Objects
      </h3>
      <ul id="object-list" class={css({ listStyle: "none", p: 0, m: 0 })}>
        {objects.map((obj) => (
          <li
            class={css({
              cursor: "pointer",
              p: 1,
              borderRadius: "sm",
              bg: selected === obj ? "token(colors.bg.accent)" : undefined,
              fontWeight: selected === obj ? "bold" : undefined,
              mb: 1,
              fontSize: "sm",
              _hover: { bg: "#f0f0ff" },
              transition: "background 0.2s",
            })}
            onClick={() => onSelect(obj)}
          >
            {obj.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
