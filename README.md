# Interactive 3D Robot Cell Viewer (Rafael Beckel)

## Task Description

Build a browser-based interactive viewer to visualize an automation robot cell using a real 3D robot model (e.g., UR5) and primitives for other components.

[Original Task Description File](3D_Coding_Challenge_Senior_Frontend.pdf)

### Time Spent

About 6 hours divided across two days (3 hours each). I plan to revisit it today later to refine the UI and double check if I did not miss anything important.

## Overview

The 3D viewer is built with **Three.js** for rendering and **Preact** for the UI, using [PandaCSS](https://panda-css.com/) for styling and [preact/signals](https://preactjs.com/guide/v10/signals/) for reactivity.

The application loads its scene definition from a JSON file (`public/scene.json`), which specifies the objects, their types, parameters, and initial positions. Each object type is implemented as a factory in `src/objects/` and registered in `src/core/objectRegistry.ts`. This makes the architecture highly extensible and modular.

---

## Setup

1. **Install dependencies**

   ```sh
   pnpm install
   # or
   npm install
   ```

2. **Run the development server**

   ```sh
   pnpm dev
   # or
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser.

3. **Build for production**

   ```sh
   pnpm build
   # or
   npm run build
   ```

4. **Preview production build**

   ```sh
   pnpm preview
   # or
   npm run preview
   ```

---

## Architecture Overview

- **src/core/renderer.tsx**: Sets up the Three.js scene, camera, renderer, lighting, controls, and postprocessing (outline, FXAA).
- **src/core/sceneManager.ts**: Loads and processes the scene definition from JSON, instantiates objects using registered factories, and applies parameters.
- **src/core/objectRegistry.ts**: Registers all available object factories (Robot, Pallet, Conveyor) for use in the scene.
- **src/objects/**: Contains modular object factories. Each factory implements a `create(params)` method returning a Three.js Object3D.
- **src/ui/panel.tsx**: Implements the sidebar components.
- **src/ui/state.tsx**: Centralized reactive state for objects, selection, and UI toggles.
- **src/components/**: Reusable UI components for the sidebar (object list, property editor, toggles, etc.).
- **src/utils/objectUtils.ts**: Utility for applying position, rotation, scale, and name parameters to Three.js objects.
- **public/scene.json**: Scene definition file specifying all objects, their types, parameters, and initial state.
- **public/UR5e.gltf**: The robot model (ensure this file is present).
- **styled-system/**: PandaCSS configuration and generated styles for consistent, themeable UI.

### Scene Definition & Extensibility

- The scene is defined in `public/scene.json`:

  - Each object has an `id`, `type` (e.g., "UR5eRobot", "Pallet", "Conveyor"), `name`, and `parameters` (position, rotation, scale, and type-specific options).
  - Example:

    ```json
    {
      "id": "robot1",
      "type": "UR5eRobot",
      "name": "UR5e Robot Arm",
      "parameters": {
        "modelPath": "/UR5e.gltf",
        "position": [0, 0, 0],
        "rotation": [0, 0, 0],
        "scale": [1, 1, 1]
      }
    }
    ```

- To add new object types, create a new factory in `src/objects/`, register it in `src/core/objectRegistry.ts`, and reference it by type in `scene.json`.
- Factories can load models (GLTF, primitives, etc.), set up animations, and apply parameters from the scene definition.

### UI Components

- **Sidebar**: Lists all scene objects, allows selection, and provides position editing for the selected object.
- **Settings**: Toggle grid and viewport gizmo visibility.
- **Responsive**: Sidebar can be collapsed/expanded.
- **Live Editing**: Changes to object positions are immediately reflected in the 3D view.

### Styling

- Uses [PandaCSS](https://panda-css.com/) for utility-first, themeable styling.
- All UI components are styled using PandaCSS classes and tokens.
- Object outline implemented as a post-processing effect

---

## License

© Unchained Robotics - All Rights Reserved
