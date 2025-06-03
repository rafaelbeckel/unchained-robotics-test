import { signal } from "@preact/signals";
import type { Object3D } from "three";

export const state = {
  objects: signal<Object3D[]>([]),
  selected: signal<Object3D | null>(null),
  gridVisible: signal(true),
  gizmoVisible: signal(true),
};
