import "../styled-system/styles.css";
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
} from "./core/renderer";
// import { getAllSceneObjects } from "./core/loader"; // No longer used for primary loading
import "./core/objectRegistry"; // IMPORTANT: Ensures factories are registered on startup
import { loadSceneFromFile } from "./core/sceneManager";
// import { getRobotMixer } from "./objects/UR5eRobot"; // No longer exists / needed globally
import { render } from "preact";
import { Panel } from "./ui/panel";
import { state } from "./ui/state";
import * as THREE from "three";
import { ViewportGizmo } from "three-viewport-gizmo";
import { signal, useSignalEffect } from "@preact/signals";
import type { SceneInstance } from "./types";

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

// Sidebar collapsed state (shared between main and Panel)
export const sidebarCollapsed = signal(false);
// export const reloadSceneTrigger = signal(0); // Signal to trigger scene reload

// Setup ThreeJS renderer, scene, camera
setupRenderer();

// Function to dispose of an Object3D and its descendants
function disposeObject(object: THREE.Object3D) {
  if (!object) return;

  // Dispose geometries and materials
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

  // Recursively dispose children
  if (object.children) {
    object.children.slice().forEach((child) => disposeObject(child)); // Use slice to avoid modifying array while iterating
  }

  // If the object has a mixer (e.g., robot), stop all actions
  if (
    object.userData.mixer &&
    typeof object.userData.mixer.stopAllAction === "function"
  ) {
    object.userData.mixer.stopAllAction();
  }
  // We don't explicitly dispose the mixer itself, Three.js might handle it or it might not be necessary
  // if the object holding it is removed from scene and JS garbage collection takes over.
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

async function loadAndPopulateScene() {
  const scene = getScene();
  const camera = getCamera();
  const controls = getControls();

  // 1. Clear existing objects from the scene and state
  const objectsToRemove = [...state.objects.value]; // Create a copy for iteration

  if (objectsToRemove.length > 0) {
    console.log(
      `[SCENE RELOAD] Clearing ${objectsToRemove.length} old objects.`
    );
    objectsToRemove.forEach((obj) => {
      console.log(
        `[SCENE RELOAD] Attempting to remove and dispose: ${obj.name} (UUID: ${obj.uuid})`
      );
      disposeObject(obj);
      scene.remove(obj);
    });

    // Verify actual scene children after removal
    const remainingSceneObjects = scene.children.filter(
      (c) => !isHelperObject(c, camera)
    );
    console.log(
      `[SCENE RELOAD] After clearing, ${remainingSceneObjects.length} non-helper objects remain in scene:`,
      remainingSceneObjects.map((o) => ({
        name: o.name,
        uuid: o.uuid,
        type: o.type,
      }))
    );
  }

  state.objects.value = []; // Clear the signal's array
  state.selected.value = null;
  updateOutlinePassSelection([]); // Clear outline pass selection

  // 2. Load new scene definition
  console.log("[SCENE RELOAD] Fetching new scene definition...");
  const { sceneInstances, defaultSelectedInstance, sceneSettings } =
    await loadSceneFromFile("/scene.json");

  // 3. Apply scene settings (e.g., camera)
  if (sceneSettings?.cameraPosition) {
    camera.position.set(...sceneSettings.cameraPosition);
  } else {
    camera.position.set(...DEFAULT_CAMERA_POSITION);
  }
  if (sceneSettings?.cameraLookAt) {
    camera.lookAt(...sceneSettings.cameraLookAt);
    controls.target.set(...sceneSettings.cameraLookAt);
  } else {
    camera.lookAt(...DEFAULT_CAMERA_LOOKAT);
    controls.target.set(...DEFAULT_CAMERA_LOOKAT);
  }
  controls.update();

  // 4. Populate scene with new objects
  const threeObjects: THREE.Object3D[] = [];
  console.log(
    `[SCENE RELOAD] Processing ${sceneInstances.length} instances from new definition.`
  );
  for (const instance of sceneInstances) {
    if (instance.object3D) {
      console.log(
        `[SCENE RELOAD] Adding new object to scene: ${instance.object3D.name} (UUID: ${instance.object3D.uuid})`
      );
      scene.add(instance.object3D);
      threeObjects.push(instance.object3D);
    } else {
      console.warn(
        `[SCENE RELOAD] Scene instance ${instance.id} (type: ${instance.type}) did not produce an object3D.`
      );
    }
  }
  state.objects.value = [...threeObjects];

  // 5. Set selected object
  if (defaultSelectedInstance && defaultSelectedInstance.object3D) {
    state.selected.value = defaultSelectedInstance.object3D;
  } else if (threeObjects.length > 0) {
    state.selected.value = threeObjects[0];
  }
  console.log(
    `[SCENE RELOAD] Scene reloaded. Objects in state: ${
      state.objects.value.length
    }. Selected: ${state.selected.value?.name ?? "None"}`
  );
  const finalSceneObjects = scene.children.filter(
    (c) => !isHelperObject(c, camera)
  );
  console.log(
    `[SCENE RELOAD] Final non-helper object count in scene: ${finalSceneObjects.length}`,
    finalSceneObjects.map((o) => ({ name: o.name, uuid: o.uuid, type: o.type }))
  );
}

// Update outline pass when selection changes
state.selected.subscribe((currentSelection) => {
  if (currentSelection) {
    updateOutlinePassSelection([currentSelection]);
  } else {
    updateOutlinePassSelection([]);
  }
});

// Initial load and subscribe to reload trigger
loadAndPopulateScene();
// reloadSceneTrigger.subscribe(() => {
// console.log("Reload scene triggered...");
// loadAndPopulateScene();
// });

// Mount Preact sidebar UI
const uiPanel = document.getElementById("ui-panel");
render(
  <Panel
    state={state}
    sidebarCollapsed={sidebarCollapsed}
    // onReloadScene={() => (reloadSceneTrigger.value += 1)}
  />,
  uiPanel!
);

// Animation loop
const clock = new THREE.Clock();

// Viewport Gizmo setup
let gizmo: any = null;
function mountGizmo() {
  if (gizmo) {
    // Remove the gizmo from DOM if it exists
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

  // Update animations for objects that have a mixer
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

// Remove axesHelper from gizmo toggle, only show with grid
let gridHelper: THREE.GridHelper | null = null;
let axesHelper: THREE.AxesHelper | null = null;

function updateHelpers() {
  const scene = getScene();
  // Grid and axes at origin
  if (state.gridVisible.value) {
    if (!gridHelper) {
      gridHelper = new THREE.GridHelper(
        GRID_HELPER_SIZE,
        GRID_HELPER_DIVISIONS,
        GRID_HELPER_COLOR_CENTER_LINE,
        GRID_HELPER_COLOR_GRID
      );
      gridHelper.position.y = 0; // Ensure it's on the ground plane
      scene.add(gridHelper);
    }
    if (!axesHelper) {
      axesHelper = new THREE.AxesHelper(AXES_HELPER_SIZE);
      axesHelper.position.set(0, AXES_HELPER_Y_OFFSET, 0); // Lift slightly to avoid z-fighting with grid
      scene.add(axesHelper);
    }
  } else {
    if (gridHelper) {
      scene.remove(gridHelper);
      gridHelper.dispose(); // Dispose geometry/material
      gridHelper = null;
    }
    if (axesHelper) {
      scene.remove(axesHelper);
      axesHelper.dispose(); // Dispose geometry/material
      axesHelper = null;
    }
  }
}

state.gridVisible.subscribe(updateHelpers);
// Initial helpers
updateHelpers();
// Mount gizmo initially
mountGizmo();

// --- Responsive sidebar logic ---
function updateSceneSize() {
  const collapsed = sidebarCollapsed.value;
  // Adjust width: 40px for collapsed (width of SidebarContainer when collapsed)
  // SIDEBAR_WIDTH (300px) for expanded
  const currentSidebarWidth = collapsed
    ? COLLAPSED_SIDEBAR_WIDTH
    : SIDEBAR_WIDTH;
  const width = window.innerWidth - currentSidebarWidth;
  const height = window.innerHeight;
  const camera = getCamera();
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  getRenderer().setSize(width, height);
  if (gizmo) gizmo.update(); // Gizmo might need update on resize too

  // Call the imported function from renderer.tsx to update core components
  updateCoreRendererSize(width, height);
}

sidebarCollapsed.subscribe(updateSceneSize);
window.addEventListener("resize", updateSceneSize);
// Initial size
updateSceneSize();
