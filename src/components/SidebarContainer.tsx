import { css } from "../../styled-system/css";
import { ComponentChildren } from "preact";

interface SidebarContainerProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  children: ComponentChildren;
}

const SIDEBAR_BG_COLOR = "#bfc2d6";

export function SidebarContainer({
  collapsed,
  setCollapsed,
  children,
}: SidebarContainerProps) {
  function handleSidebarClick() {
    if (collapsed) setCollapsed(false);
  }
  return (
    <div
      class={css({
        padding: 4,
        fontFamily: "system-ui",
        color: "token(colors.text.DEFAULT)",
        bg: SIDEBAR_BG_COLOR,
        height: "100vh",
        boxSizing: "border-box",
        minWidth: 0,
        width: collapsed ? "40px" : "300px",
        transition: "width 0.3s cubic-bezier(.4,0,.2,1)",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRight: "1px solid token(colors.border.DEFAULT)",
        shadow: "card",
        position: "relative",
        overflow: "hidden",
        cursor: collapsed ? "pointer" : undefined,
      })}
      onClick={handleSidebarClick}
    >
      {children}
    </div>
  );
}
