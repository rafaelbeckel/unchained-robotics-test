import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";

export const SIDEBAR_WIDTH = 300;

const SCENE_BACKGROUND_COLOR = 0x707088;
const CAMERA_FOV = 45;
const CAMERA_NEAR_PLANE = 0.1;
const CAMERA_FAR_PLANE = 1000;
const CAMERA_INITIAL_POSITION: [number, number, number] = [2, 2, 4];
const CAMERA_INITIAL_LOOKAT: [number, number, number] = [0, 0.5, 0];

const AMBIENT_LIGHT_COLOR = 0xffffff;
const AMBIENT_LIGHT_INTENSITY = 0.8;
const DIRECTIONAL_LIGHT_COLOR = 0xffffff;
const DIRECTIONAL_LIGHT_INTENSITY = 0.9;
const DIRECTIONAL_LIGHT_POSITION: [number, number, number] = [5, 10, 7];

const OUTLINE_PASS_EDGE_STRENGTH = 2.0;
const OUTLINE_PASS_EDGE_GLOW = 0.7;
const OUTLINE_PASS_EDGE_THICKNESS = 1.5;
const OUTLINE_PASS_PULSE_PERIOD = 0;
const OUTLINE_PASS_VISIBLE_EDGE_COLOR = "#FFFF00";
const OUTLINE_PASS_HIDDEN_EDGE_COLOR = "#FFFF00";

let scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  controls: OrbitControls,
  composer: EffectComposer,
  outlinePass: OutlinePass,
  effectFXAA: ShaderPass;

export function setupRenderer() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(SCENE_BACKGROUND_COLOR);

  const initialWidth = window.innerWidth - SIDEBAR_WIDTH;
  const initialHeight = window.innerHeight;
  camera = new THREE.PerspectiveCamera(
    CAMERA_FOV,
    initialWidth / initialHeight,
    CAMERA_NEAR_PLANE,
    CAMERA_FAR_PLANE
  );
  camera.position.set(...CAMERA_INITIAL_POSITION);
  camera.lookAt(...CAMERA_INITIAL_LOOKAT);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(initialWidth, initialHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  document.getElementById("scene-container")!.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(...CAMERA_INITIAL_LOOKAT);
  controls.update();

  const ambient = new THREE.AmbientLight(
    AMBIENT_LIGHT_COLOR,
    AMBIENT_LIGHT_INTENSITY
  );
  scene.add(ambient);
  const dir = new THREE.DirectionalLight(
    DIRECTIONAL_LIGHT_COLOR,
    DIRECTIONAL_LIGHT_INTENSITY
  );
  dir.position.set(...DIRECTIONAL_LIGHT_POSITION);
  scene.add(dir);

  composer = new EffectComposer(renderer);
  composer.setSize(initialWidth, initialHeight);

  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  outlinePass = new OutlinePass(
    new THREE.Vector2(initialWidth, initialHeight),
    scene,
    camera
  );
  outlinePass.edgeStrength = OUTLINE_PASS_EDGE_STRENGTH;
  outlinePass.edgeGlow = OUTLINE_PASS_EDGE_GLOW;
  outlinePass.edgeThickness = OUTLINE_PASS_EDGE_THICKNESS;
  outlinePass.pulsePeriod = OUTLINE_PASS_PULSE_PERIOD;
  outlinePass.visibleEdgeColor.set(OUTLINE_PASS_VISIBLE_EDGE_COLOR);
  outlinePass.hiddenEdgeColor.set(OUTLINE_PASS_HIDDEN_EDGE_COLOR);
  composer.addPass(outlinePass);

  effectFXAA = new ShaderPass(FXAAShader);
  effectFXAA.uniforms["resolution"].value.set(
    1 / initialWidth,
    1 / initialHeight
  );
  composer.addPass(effectFXAA);
}

export function updateRendererSize(width: number, height: number) {
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  composer.setSize(width, height);
  effectFXAA.uniforms["resolution"].value.set(1 / width, 1 / height);
}

export function getScene(): THREE.Scene {
  return scene;
}
export function getCamera(): THREE.PerspectiveCamera {
  return camera;
}
export function getRenderer(): THREE.WebGLRenderer {
  return renderer;
}
export function getComposer(): EffectComposer {
  return composer;
}
export function getControls(): OrbitControls {
  return controls;
}

export function updateOutlinePassSelection(selectedObjects: THREE.Object3D[]) {
  if (outlinePass) {
    outlinePass.selectedObjects = selectedObjects;
  }
}
