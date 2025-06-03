import { Object3D, Vector3, Euler } from "three";

export interface ObjectParameters {
  position?: number[] | Vector3;
  rotation?: number[] | Euler;
  scale?: number[] | Vector3;
  name?: string;
  [key: string]: any;
}

export interface SceneObjectFactory {
  create(params?: ObjectParameters): Object3D | Promise<Object3D>;
}

export interface SceneInstanceConfig {
  id: string;
  type: string;
  name?: string;
  parameters?: Omit<ObjectParameters, 'name'>;
}

export interface SceneInstance extends SceneInstanceConfig {
  object3D: Object3D;
}
