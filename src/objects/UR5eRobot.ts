import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from "three";
import type { Object3D, AnimationMixer } from "three";
import type { SceneObjectFactory, ObjectParameters } from "../types";
import { applyObjectParameters } from "../utils/objectUtils";

const DEFAULT_ROBOT_POSITION: [number, number, number] = [0, 0, 0];
const DEFAULT_ROBOT_MODEL_PATH = "/UR5e.gltf";
const FALLBACK_ROBOT_NAME = "UR5e Robot";

const UR5eRobotFactory: SceneObjectFactory = {
  async create(params?: ObjectParameters): Promise<Object3D> {
    const modelPath = params?.modelPath as string || DEFAULT_ROBOT_MODEL_PATH;

    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      loader.load(
        modelPath,
        (gltf) => {
          const robot = gltf.scene;

          robot.position.set(...DEFAULT_ROBOT_POSITION);

          applyObjectParameters(robot, params);

          if (!robot.name) {
            robot.name = FALLBACK_ROBOT_NAME;
          }

          if (gltf.animations && gltf.animations.length > 0) {
            const mixer = new THREE.AnimationMixer(robot);
            gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
            robot.userData.mixer = mixer;
          }
          resolve(robot);
        },
        undefined,
        (error) => {
          console.error(`Error loading GLTF model from ${modelPath}:`, error);
          reject(error);
        }
      );
    });
  },
};

export default UR5eRobotFactory; 
