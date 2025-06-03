import { signal } from "@preact/signals";
import type { Object3D } from "three";

export const state = {
  objects: signal<Object3D[]>([]), // Array of scene objects
  selected: signal<Object3D | null>(null), // Currently selected object
  gridVisible: signal(true),
  gizmoVisible: signal(true),
};
