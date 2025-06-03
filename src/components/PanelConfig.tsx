import { css } from "../../styled-system/css";
import { ToggleControl } from "./ToggleControl";

interface PanelConfigProps {
  gridVisible: boolean;
  setGridVisible: (v: boolean) => void;
  gizmoVisible: boolean;
  setGizmoVisible: (v: boolean) => void;
}

export function PanelConfig({
  gridVisible,
  setGridVisible,
  gizmoVisible,
  setGizmoVisible,
}: PanelConfigProps) {
  return (
    <div
      class={css({
        mt: 1,
        p: 2,
        border: "1px solid token(colors.border.DEFAULT)",
        borderRadius: "sm",
        bg: "token(colors.bg.card)",
        boxShadow: "card",
        minWidth: 0,
        width: "100%",
        maxWidth: "100%",
      })}
    >
      <ToggleControl
        label="Show Grid"
        checked={gridVisible}
        onChange={setGridVisible}
        id="toggle-grid"
      />
      <ToggleControl
        label="Show Viewport Gizmo"
        checked={gizmoVisible}
        onChange={setGizmoVisible}
        id="toggle-gizmo"
      />
    </div>
  );
}
