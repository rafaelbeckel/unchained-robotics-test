// This file's original purpose of dynamically loading all objects for the scene
// has been superseded by the new scene.json and objectRegistry.ts system.
// It can be kept if dynamic discovery of object factories is needed for other tools,
// or removed if no longer used.

import type { SceneObjectFactory } from "../types";

// Dynamically import all modules in src/objects/
// This glob import might be useful for development tools or a plugin system,
// but it's not used by the core scene loading mechanism anymore.
const modules = import.meta.glob<{ default: SceneObjectFactory }>(
  "../objects/*.ts",
  {
    eager: true, // `eager: true` means they are imported synchronously at module load time
  }
);

/**
 * Retrieves all default exports from .ts files in src/objects/
 * assuming they are SceneObjectFactory implementations.
 * This is not used by the main scene loading logic anymore.
 * @returns An array of SceneObjectFactory.
 */
export function getAllSceneObjectFactories(): SceneObjectFactory[] {
  return Object.values(modules)
    .map((mod) => mod.default)
    .filter((factory) => factory && typeof factory.create === "function"); // Basic validation
}

// console.log("Available object factories found by loader.ts:", getAllSceneObjectFactories().map(f => f.constructor.name));
// This can be useful for debugging or listing available types if this file is still used.
