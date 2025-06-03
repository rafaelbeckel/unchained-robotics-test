import type { SceneObjectFactory } from "@/types";
import PalletFactory from "@/objects/Pallet";
import ConveyorFactory from "@/objects/Conveyor";
import UR5eRobotFactory from "@/objects/UR5eRobot";

const objectFactories = new Map<string, SceneObjectFactory>();

export function registerObjectFactory(type: string, factory: SceneObjectFactory) {
  if (objectFactories.has(type)) {
  }
  objectFactories.set(type, factory);
}

export function getObjectFactory(type: string): SceneObjectFactory | undefined {
  return objectFactories.get(type);
}

registerObjectFactory("Pallet", PalletFactory);
registerObjectFactory("Conveyor", ConveyorFactory);
registerObjectFactory("UR5eRobot", UR5eRobotFactory);
