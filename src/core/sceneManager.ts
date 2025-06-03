import { getObjectFactory } from "./objectRegistry";
import type { SceneInstanceConfig, SceneInstance, ObjectParameters } from "../types";

interface SceneDefinition {
  settings?: {
    defaultSelectedId?: string;
    cameraPosition?: [number, number, number];
    cameraLookAt?: [number, number, number];
  };
  objects: SceneInstanceConfig[];
}

export async function loadSceneFromFile(filePath: string): Promise<{
  sceneInstances: SceneInstance[],
  defaultSelectedInstance?: SceneInstance,
  sceneSettings?: SceneDefinition['settings'];
}> {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to fetch scene file: ${response.statusText} (path: ${filePath})`);
    }
    const sceneDefinition = (await response.json()) as SceneDefinition;
    const { sceneInstances, defaultSelectedInstance } = await processSceneDefinition(sceneDefinition);
    return { sceneInstances, defaultSelectedInstance, sceneSettings: sceneDefinition.settings };
  } catch (error) {
    return { sceneInstances: [], defaultSelectedInstance: undefined, sceneSettings: undefined };
  }
}

export async function processSceneDefinition(sceneDefinition: SceneDefinition): Promise<{
  sceneInstances: SceneInstance[],
  defaultSelectedInstance?: SceneInstance;
}> {
  const sceneInstances: SceneInstance[] = [];
  let defaultSelectedInstance: SceneInstance | undefined = undefined;

  for (const instanceConfig of sceneDefinition.objects) {
    const factory = getObjectFactory(instanceConfig.type);
    if (!factory) {
      continue;
    }

    try {
      const factoryParams: ObjectParameters = {
        ...(instanceConfig.parameters || {}),
        name: instanceConfig.name || instanceConfig.id,
        position: instanceConfig.parameters?.position,
        rotation: instanceConfig.parameters?.rotation,
        scale: instanceConfig.parameters?.scale,
      };

      const object3D = await factory.create(factoryParams);

      object3D.name = instanceConfig.name || instanceConfig.id;

      const sceneInstance: SceneInstance = {
        id: instanceConfig.id,
        type: instanceConfig.type,
        name: object3D.name,
        parameters: instanceConfig.parameters,
        object3D: object3D,
      };
      sceneInstances.push(sceneInstance);

      if (sceneDefinition.settings?.defaultSelectedId === instanceConfig.id) {
        defaultSelectedInstance = sceneInstance;
      }

    } catch (error) {
    }
  }
  return { sceneInstances, defaultSelectedInstance };
} 
