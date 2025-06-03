import * as THREE from "three";
import type { SceneObjectFactory, ObjectParameters } from "@/types";
import { applyObjectParameters } from "@/utils/objectUtils";

const DEFAULT_PALLET_WIDTH = 0.4;
const DEFAULT_PALLET_HEIGHT = 0.1;
const DEFAULT_PALLET_DEPTH = 0.4;
const DEFAULT_PALLET_COLOR = 0x996633;
const DEFAULT_PALLET_POSITION: [number, number, number] = [-0.8, 0.05, 0];
const FALLBACK_PALLET_NAME = "Pallet";

const PalletFactory: SceneObjectFactory = {
  create(params?: ObjectParameters) {
    const geometry = new THREE.BoxGeometry(
      params?.width ?? DEFAULT_PALLET_WIDTH,
      params?.height ?? DEFAULT_PALLET_HEIGHT,
      params?.depth ?? DEFAULT_PALLET_DEPTH
    );
    const material = new THREE.MeshStandardMaterial({
      color: params?.color ?? DEFAULT_PALLET_COLOR,
    });
    const pallet = new THREE.Mesh(geometry, material);

    pallet.position.set(...DEFAULT_PALLET_POSITION);

    applyObjectParameters(pallet, params);

    if (!pallet.name) {
      pallet.name = FALLBACK_PALLET_NAME;
    }

    return pallet;
  },
};

export default PalletFactory; 
