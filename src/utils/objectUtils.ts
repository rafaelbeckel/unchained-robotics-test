import * as THREE from "three";
import type { ObjectParameters } from "../types";

export function applyObjectParameters(
  object: THREE.Object3D,
  params?: ObjectParameters
) {
  if (!params) return;

  if (typeof params.name === 'string') {
    object.name = params.name;
  }

  if (params.position) {
    if (Array.isArray(params.position)) {
      object.position.set(
        params.position[0] ?? object.position.x,
        params.position[1] ?? object.position.y,
        params.position[2] ?? object.position.z
      );
    } else {
      object.position.copy(params.position as THREE.Vector3);
    }
  }

  if (params.rotation) {
    if (Array.isArray(params.rotation)) {
      object.rotation.set(
        params.rotation[0] ?? object.rotation.x,
        params.rotation[1] ?? object.rotation.y,
        params.rotation[2] ?? object.rotation.z
      );
    } else {
      object.rotation.copy(params.rotation as THREE.Euler);
    }
  }

  if (params.scale) {
    if (Array.isArray(params.scale)) {
      object.scale.set(
        params.scale[0] ?? object.scale.x,
        params.scale[1] ?? object.scale.y,
        params.scale[2] ?? object.scale.z
      );
    } else {
      object.scale.copy(params.scale as THREE.Vector3);
    }
  }
} 
