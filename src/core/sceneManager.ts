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
    console.error("Error loading scene definition from file:", error);
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
      console.warn(`No factory found for object type: ${instanceConfig.type} (id: ${instanceConfig.id})`);
      continue;
    }

    try {
      // Parameters for the factory: combine scene-defined params with the instance name.
      // The instance name (instanceConfig.name or instanceConfig.id) is crucial for the Object3D's name property.
      const factoryParams: ObjectParameters = {
        ...(instanceConfig.parameters || {}), // Spread specific params like modelPath, length, width etc.
        name: instanceConfig.name || instanceConfig.id, // Pass the desired instance name to the factory
        // Pass position, rotation, scale from instanceConfig.parameters if they exist
        position: instanceConfig.parameters?.position,
        rotation: instanceConfig.parameters?.rotation,
        scale: instanceConfig.parameters?.scale,
      };

      const object3D = await factory.create(factoryParams);

      // The factory's `applyObjectParameters` should have used `factoryParams.name`.
      // As a safeguard, or if factories don't robustly set name from params:
      object3D.name = instanceConfig.name || instanceConfig.id;

      // The factory should also apply position/rotation/scale based on factoryParams.
      // If the factory sets defaults and then applies params, scene definition will override.

      const sceneInstance: SceneInstance = {
        id: instanceConfig.id,
        type: instanceConfig.type,
        name: object3D.name, // Use the name now on the Object3D
        parameters: instanceConfig.parameters, // Store original parameters
        object3D: object3D,
      };
      sceneInstances.push(sceneInstance);

      if (sceneDefinition.settings?.defaultSelectedId === instanceConfig.id) {
        defaultSelectedInstance = sceneInstance;
      }

    } catch (error) {
      console.error(
        `Error creating object instance "${instanceConfig.id}" of type "${instanceConfig.type}":`,
        error
      );
    }
  }
  return { sceneInstances, defaultSelectedInstance };
} 
