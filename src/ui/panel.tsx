import { useSignalEffect } from "@preact/signals";
import { useState } from "preact/hooks";
import { ObjectList } from "../components/ObjectList";
import { ObjectProperties } from "../components/ObjectProperties";
import { SidebarContainer } from "../components/SidebarContainer";
import { SidebarSettings } from "../components/SidebarSettings";
import { Signal } from "@preact/signals";
import { css } from "../../styled-system/css";

interface PanelProps {
  state: any;
  sidebarCollapsed: Signal<boolean>;
}

const DEFAULT_POSITION_FIXED_DIGITS = 2;

export function Panel({ state, sidebarCollapsed }: PanelProps) {
  const objects = state.objects;
  const selected = state.selected;
  const [showConfig, setShowConfig] = useState(false);

  // Update input fields when selection changes
  useSignalEffect(() => {
    if (!selected.value) return;
    const { x, y, z } = selected.value.position;
    (document.getElementById("pos-x") as HTMLInputElement).value = x.toFixed(
      DEFAULT_POSITION_FIXED_DIGITS
    );
    (document.getElementById("pos-y") as HTMLInputElement).value = y.toFixed(
      DEFAULT_POSITION_FIXED_DIGITS
    );
    (document.getElementById("pos-z") as HTMLInputElement).value = z.toFixed(
      DEFAULT_POSITION_FIXED_DIGITS
    );
    (
      document.getElementById("selected-object-name") as HTMLDivElement
    ).textContent = selected.value.name;
  });

  // Handle position input changes
  function onPosChange(axis: string, e: Event) {
    if (!selected.value) return;
    const v = parseFloat((e.target as HTMLInputElement).value);
    if (!isNaN(v)) {
      selected.value.position[axis] = v;
    }
  }

  // For toggles, use signals for reactivity
  const gridVisible = state.gridVisible;
  const gizmoVisible = state.gizmoVisible;

  return (
    <SidebarContainer
      collapsed={sidebarCollapsed.value}
      setCollapsed={(v) => (sidebarCollapsed.value = v)}
    >
      {/* Collapse/expand button */}
      <button
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          marginBottom: 8,
          alignSelf: "flex-end",
        }}
        title={sidebarCollapsed.value ? "Expand sidebar" : "Collapse sidebar"}
        onClick={(e) => {
          e.stopPropagation();
          sidebarCollapsed.value = !sidebarCollapsed.value;
        }}
      >
        {sidebarCollapsed.value ? (
          <i className="fa-solid fa-angle-right" style={{ fontSize: 20 }}></i>
        ) : (
          <i className="fa-solid fa-angle-left" style={{ fontSize: 20 }}></i>
        )}
      </button>
      {/* Only show content if not collapsed */}
      {!sidebarCollapsed.value && (
        <>
          <ObjectList
            objects={objects.value}
            selected={selected.value}
            onSelect={(obj: any) => (state.selected.value = obj)}
          />
          <div
            style={{
              borderTop: "1px solid var(--colors-border-DEFAULT, #ccc)",
              margin: "8px 0",
            }}
          />
          <ObjectProperties
            selected={selected.value}
            onPosChange={onPosChange}
          />
        </>
      )}
      <SidebarSettings
        showConfig={showConfig}
        setShowConfig={setShowConfig}
        gridVisible={gridVisible.value}
        setGridVisible={(v: boolean) => (gridVisible.value = v)}
        gizmoVisible={gizmoVisible.value}
        setGizmoVisible={(v: boolean) => (gizmoVisible.value = v)}
        collapsed={sidebarCollapsed.value}
      />
    </SidebarContainer>
  );
}
