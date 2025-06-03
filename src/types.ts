import { Object3D, Vector3, Euler } from "three";

export interface ObjectParameters {
  position?: number[] | Vector3; // Array [x, y, z] for JSON
  rotation?: number[] | Euler; // Array [x, y, z] (Euler angles in radians) for JSON
  scale?: number[] | Vector3;    // Array [x, y, z] for JSON
  name?: string; // User-defined name for this specific instance, passed to factory
  [key: string]: any; // For object-specific parameters like modelPath, length, width etc.
}

export interface SceneObjectFactory {
  create(params?: ObjectParameters): Object3D | Promise<Object3D>;
}

export interface SceneInstanceConfig {
  id: string;         // Unique ID for this instance in the scene
  type: string;       // Type of object (e.g., "Pallet", "UR5eRobot"). Maps to a SceneObjectFactory.
  name?: string;      // Display name for UI. Falls back to id if not provided.
  parameters?: Omit<ObjectParameters, 'name'>; // Original parameters from JSON, 'name' comes from SceneInstanceConfig.name
}

// Runtime representation of an object instance in the scene
export interface SceneInstance extends SceneInstanceConfig {
  object3D: Object3D; // The actual Three.js object
}
