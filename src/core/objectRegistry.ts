import type { SceneObjectFactory } from "@/types";

// Import factories explicitly.
// This ensures they are part of the bundle and avoids issues with dynamic imports in some environments.
import PalletFactory from "@/objects/Pallet";
import ConveyorFactory from "@/objects/Conveyor";
import UR5eRobotFactory from "@/objects/UR5eRobot";
// Import other object factories here as they are created:
// import AnotherObjectFactory from "../objects/AnotherObject";

const objectFactories = new Map<string, SceneObjectFactory>();

export function registerObjectFactory(type: string, factory: SceneObjectFactory) {
  if (objectFactories.has(type)) {
  }
  objectFactories.set(type, factory);
}

export function getObjectFactory(type: string): SceneObjectFactory | undefined {
  return objectFactories.get(type);
}

// --- Register all known object factories ---
registerObjectFactory("Pallet", PalletFactory);
registerObjectFactory("Conveyor", ConveyorFactory);
registerObjectFactory("UR5eRobot", UR5eRobotFactory);
// registerObjectFactory("AnotherObject", AnotherObjectFactory);


// This file, by being imported (e.g., in main.tsx or sceneManager.ts),
// ensures that the factories are registered when the application starts. 
