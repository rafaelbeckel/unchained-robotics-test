import "@/../styled-system/styles.css";
import {
  setupRenderer,
  getScene,
  getCamera,
  getRenderer,
  getControls,
  SIDEBAR_WIDTH,
  getComposer,
  updateOutlinePassSelection,
  updateRendererSize as updateCoreRendererSize,
} from "@/core/renderer";
import "@/core/objectRegistry";
import { loadSceneFromFile } from "@/core/sceneManager";
import { render } from "preact";
import { Panel } from "@/ui/panel";
import { state } from "@/ui/state";
import * as THREE from "three";
import { ViewportGizmo } from "three-viewport-gizmo";
import { signal } from "@preact/signals";

const DEFAULT_CAMERA_POSITION: [number, number, number] = [2, 2, 4];
const DEFAULT_CAMERA_LOOKAT: [number, number, number] = [0, 0.5, 0];
const COLLAPSED_SIDEBAR_WIDTH = 40;
const GIZMO_SIZE = 80;
const GIZMO_OFFSET_TOP = 16;
const GIZMO_OFFSET_LEFT = 16;
const GRID_HELPER_SIZE = 10;
const GRID_HELPER_DIVISIONS = 20;
const GRID_HELPER_COLOR_CENTER_LINE = 0xcccccc;
const GRID_HELPER_COLOR_GRID = 0xd0d0d0;
const AXES_HELPER_SIZE = 0.5;
const AXES_HELPER_Y_OFFSET = 0.001;

export const sidebarCollapsed = signal(false);

setupRenderer();

function disposeObject(object: THREE.Object3D) {
  if (!object) return;

  if ((object as any).geometry) {
    (object as any).geometry.dispose();
  }

  if ((object as any).material) {
    if (Array.isArray((object as any).material)) {
      (object as any).material.forEach((material: THREE.Material) =>
        material.dispose()
      );
    } else {
      (object as any).material.dispose();
    }
  }

  if (object.children) {
    object.children.slice().forEach((child) => disposeObject(child));
  }

  if (
    object.userData.mixer &&
    typeof object.userData.mixer.stopAllAction === "function"
  ) {
    object.userData.mixer.stopAllAction();
  }
}

const isHelperObject = (object: THREE.Object3D, camera: THREE.Camera) => {
  return (
    object instanceof THREE.GridHelper ||
    object instanceof THREE.AxesHelper ||
    object instanceof THREE.AmbientLight ||
    object instanceof THREE.DirectionalLight ||
    object === camera
  );
};

function clearSceneAndState(scene: THREE.Scene, camera: THREE.Camera) {
  const objectsToRemove = [...state.objects.value];
  if (objectsToRemove.length > 0) {
    objectsToRemove.forEach((obj) => {
      disposeObject(obj);
      scene.remove(obj);
    });
    const remainingSceneObjects = scene.children.filter(
      (c) => !isHelperObject(c, camera)
    );
  }
  state.objects.value = [];
  state.selected.value = null;
  updateOutlinePassSelection([]);
}

async function fetchSceneDefinition() {
  return await loadSceneFromFile("/scene.json");
}

function applySceneSettings(
  camera: THREE.Camera,
  controls: any,
  sceneSettings: any
) {
  if (sceneSettings?.cameraPosition) {
    camera.position.set(
      ...(sceneSettings.cameraPosition as [number, number, number])
    );
  } else {
    camera.position.set(...DEFAULT_CAMERA_POSITION);
  }
  if (sceneSettings?.cameraLookAt) {
    camera.lookAt(...(sceneSettings.cameraLookAt as [number, number, number]));
    controls.target.set(
      ...(sceneSettings.cameraLookAt as [number, number, number])
    );
  } else {
    camera.lookAt(...DEFAULT_CAMERA_LOOKAT);
    controls.target.set(...DEFAULT_CAMERA_LOOKAT);
  }
  controls.update();
}

function populateSceneWithObjects(
  scene: THREE.Scene,
  sceneInstances: any[]
): THREE.Object3D[] {
  const threeObjects: THREE.Object3D[] = [];
  for (const instance of sceneInstances) {
    if (instance.object3D) {
      scene.add(instance.object3D);
      threeObjects.push(instance.object3D);
    }
  }
  state.objects.value = [...threeObjects];
  return threeObjects;
}

function setSelectedObject(
  defaultSelectedInstance: any,
  threeObjects: THREE.Object3D[]
) {
  if (defaultSelectedInstance && defaultSelectedInstance.object3D) {
    state.selected.value = defaultSelectedInstance.object3D;
  } else if (threeObjects.length > 0) {
    state.selected.value = threeObjects[0];
  }
}

async function loadAndPopulateScene() {
  const scene = getScene();
  const camera = getCamera();
  const controls = getControls();

  clearSceneAndState(scene, camera);

  const { sceneInstances, defaultSelectedInstance, sceneSettings } =
    await fetchSceneDefinition();

  applySceneSettings(camera, controls, sceneSettings);

  const threeObjects = populateSceneWithObjects(scene, sceneInstances);

  setSelectedObject(defaultSelectedInstance, threeObjects);

  const finalSceneObjects = scene.children.filter(
    (c) => !isHelperObject(c, camera)
  );
}

state.selected.subscribe((currentSelection) => {
  if (currentSelection) {
    updateOutlinePassSelection([currentSelection]);
  } else {
    updateOutlinePassSelection([]);
  }
});

loadAndPopulateScene();

const uiPanel = document.getElementById("ui-panel");
render(<Panel state={state} sidebarCollapsed={sidebarCollapsed} />, uiPanel!);

const clock = new THREE.Clock();

let gizmo: any = null;
function mountGizmo() {
  if (gizmo) {
    gizmo.dispose();
    gizmo = null;
  }
  if (state.gizmoVisible.value) {
    const camera = getCamera();
    const renderer = getRenderer();
    const sceneContainer = document.getElementById("scene-container");
    if (sceneContainer) {
      gizmo = new ViewportGizmo(camera, renderer, {
        size: GIZMO_SIZE,
        container: sceneContainer,
        placement: "top-right",
        offset: { top: GIZMO_OFFSET_TOP, left: GIZMO_OFFSET_LEFT },
      });
      gizmo.attachControls(getControls());
    }
  }
}

state.gizmoVisible.subscribe(mountGizmo);
window.addEventListener("resize", () => {
  if (gizmo) gizmo.update();
});

function animate() {
  requestAnimationFrame(animate);
  getControls().update();
  const delta = clock.getDelta();

  if (state.objects.value && state.objects.value.length > 0) {
    state.objects.value.forEach((obj) => {
      if (
        obj.userData.mixer &&
        typeof obj.userData.mixer.update === "function"
      ) {
        obj.userData.mixer.update(delta);
      }
    });
  }

  const composer = getComposer();
  composer.render(delta);
  if (gizmo && state.gizmoVisible.value) {
    gizmo.render();
  }
}
animate();

let gridHelper: THREE.GridHelper | null = null;
let axesHelper: THREE.AxesHelper | null = null;

function updateHelpers() {
  const scene = getScene();

  if (state.gridVisible.value) {
    if (!gridHelper) {
      gridHelper = new THREE.GridHelper(
        GRID_HELPER_SIZE,
        GRID_HELPER_DIVISIONS,
        GRID_HELPER_COLOR_CENTER_LINE,
        GRID_HELPER_COLOR_GRID
      );
      gridHelper.position.y = 0;
      scene.add(gridHelper);
    }
    if (!axesHelper) {
      axesHelper = new THREE.AxesHelper(AXES_HELPER_SIZE);
      axesHelper.position.set(0, AXES_HELPER_Y_OFFSET, 0);
      scene.add(axesHelper);
    }
  } else {
    if (gridHelper) {
      scene.remove(gridHelper);
      gridHelper.dispose();
      gridHelper = null;
    }
    if (axesHelper) {
      scene.remove(axesHelper);
      axesHelper.dispose();
      axesHelper = null;
    }
  }
}

state.gridVisible.subscribe(updateHelpers);
updateHelpers();
mountGizmo();

function updateSceneSize() {
  const collapsed = sidebarCollapsed.value;
  const currentSidebarWidth = collapsed
    ? COLLAPSED_SIDEBAR_WIDTH
    : SIDEBAR_WIDTH;
  const width = window.innerWidth - currentSidebarWidth;
  const height = window.innerHeight;
  const camera = getCamera();
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  getRenderer().setSize(width, height);
  if (gizmo) gizmo.update();

  updateCoreRendererSize(width, height);
}

sidebarCollapsed.subscribe(updateSceneSize);
window.addEventListener("resize", updateSceneSize);
updateSceneSize();
