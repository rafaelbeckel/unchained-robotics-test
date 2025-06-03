import { css } from "../../styled-system/css";
import { PanelConfig } from "@/components/PanelConfig";

interface SidebarSettingsProps {
  showConfig: boolean;
  setShowConfig: (v: boolean) => void;
  gridVisible: boolean;
  setGridVisible: (v: boolean) => void;
  gizmoVisible: boolean;
  setGizmoVisible: (v: boolean) => void;
  collapsed: boolean;
}

export function SidebarSettings({
  showConfig,
  setShowConfig,
  gridVisible,
  setGridVisible,
  gizmoVisible,
  setGizmoVisible,
  collapsed,
}: SidebarSettingsProps) {
  if (collapsed) return null;
  return (
    <div
      class={css({
        mt: "auto",
        position: "relative",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
      })}
    >
      <button
        class={css({
          background: "none",
          border: "none",
          cursor: "pointer",
          p: 1,
          borderRadius: "sm",
          _hover: { bg: "token(colors.bg.accent)" },
          display: "flex",
          alignItems: "center",
          mb: 1,
        })}
        title="Settings"
        onClick={() => setShowConfig(!showConfig)}
      >
        <i className="fa-solid fa-gear" style={{ fontSize: 18 }}></i>
      </button>
      {showConfig && (
        <PanelConfig
          gridVisible={gridVisible}
          setGridVisible={setGridVisible}
          gizmoVisible={gizmoVisible}
          setGizmoVisible={setGizmoVisible}
        />
      )}
    </div>
  );
}
