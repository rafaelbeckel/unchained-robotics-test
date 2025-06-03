import * as THREE from "three";
import type { SceneObjectFactory, ObjectParameters } from "@/types";
import { applyObjectParameters } from "@/utils/objectUtils";

const DEFAULT_CONVEYOR_LENGTH = 1.2;
const DEFAULT_CONVEYOR_WIDTH = 0.4;
const DEFAULT_ROLLER_RADIUS = 0.02;
const DEFAULT_ROLLER_SIDE_MARGIN = 0.04;
const DEFAULT_ROLLER_SPACING = 0.06;
const DEFAULT_ROLLER_COLOR = 0xcccccc;
const DEFAULT_ROLLER_SEGMENTS = 16;
const DEFAULT_ROLLER_POSITION_Y = 0.04;

const DEFAULT_SHOW_GUARD_RAILS = true;
const DEFAULT_RAIL_HEIGHT = 0.04;
const DEFAULT_RAIL_THICKNESS = 0.03;
const DEFAULT_RAIL_COLOR = 0x888888;
const DEFAULT_RAIL_POSITION_Y = 0.09;

const DEFAULT_SHOW_BASE = true;
const DEFAULT_BASE_HEIGHT = 0.04;
const DEFAULT_BASE_COLOR = 0x555555;
const DEFAULT_BASE_POSITION_Y = 0.0;

const DEFAULT_CONVEYOR_GROUP_POSITION: [number, number, number] = [1.1, 0.075, 0];
const FALLBACK_CONVEYOR_NAME = "Conveyor Belt";

const ConveyorFactory: SceneObjectFactory = {
  create(params?: ObjectParameters) {
    const conveyorGroup = new THREE.Group();

    const length = params?.length ?? DEFAULT_CONVEYOR_LENGTH;
    const width = params?.width ?? DEFAULT_CONVEYOR_WIDTH;
    const rollerRadius = params?.rollerRadius ?? DEFAULT_ROLLER_RADIUS;
    const rollerLength = width - (params?.rollerSideMargin ?? DEFAULT_ROLLER_SIDE_MARGIN);

    const rollerSpacing = params?.rollerSpacing ?? DEFAULT_ROLLER_SPACING;

    let numRollers: number;
    if (length <= rollerRadius * 2) {
      numRollers = 1;
    } else if (length <= rollerSpacing) {
      numRollers = 1;
    } else {
      numRollers = Math.floor(length / rollerSpacing) + 1;
    }
    const actualRollerDistributionLength = length - (rollerRadius * 2);
    const calculatedSpacing = numRollers > 1 ? actualRollerDistributionLength / (numRollers - 1) : 0;

    const rollerMaterial = new THREE.MeshStandardMaterial({ color: params?.rollerColor ?? DEFAULT_ROLLER_COLOR });
    for (let i = 0; i < numRollers; i++) {
      const rollerGeometry = new THREE.CylinderGeometry(
        rollerRadius,
        rollerRadius,
        rollerLength,
        DEFAULT_ROLLER_SEGMENTS
      );
      const roller = new THREE.Mesh(rollerGeometry, rollerMaterial);
      roller.rotation.x = Math.PI / 2;
      if (numRollers === 1) {
        roller.position.x = 0;
      } else {
        roller.position.x = (-length / 2) + rollerRadius + (i * calculatedSpacing);
      }
      roller.position.y = params?.rollerPositionY ?? DEFAULT_ROLLER_POSITION_Y;
      conveyorGroup.add(roller);
    }

    if (params?.showGuardRails !== false) {
      const railHeight = params?.railHeight ?? DEFAULT_RAIL_HEIGHT;
      const railThickness = params?.railThickness ?? DEFAULT_RAIL_THICKNESS;
      const railMaterial = new THREE.MeshStandardMaterial({ color: params?.railColor ?? DEFAULT_RAIL_COLOR });
      const railGeometry = new THREE.BoxGeometry(length, railHeight, railThickness);

      const leftRail = new THREE.Mesh(railGeometry, railMaterial);
      leftRail.position.set(0, (params?.railPositionY ?? DEFAULT_RAIL_POSITION_Y), width / 2 - railThickness / 2);
      conveyorGroup.add(leftRail);

      const rightRail = new THREE.Mesh(railGeometry, railMaterial);
      rightRail.position.set(0, (params?.railPositionY ?? DEFAULT_RAIL_POSITION_Y), -(width / 2 - railThickness / 2));
      conveyorGroup.add(rightRail);
    }

    if (params?.showBase !== false) {
      const baseHeight = params?.baseHeight ?? DEFAULT_BASE_HEIGHT;
      const baseMaterial = new THREE.MeshStandardMaterial({ color: params?.baseColor ?? DEFAULT_BASE_COLOR });
      const baseGeometry = new THREE.BoxGeometry(length, baseHeight, width);
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      base.position.set(0, params?.basePositionY ?? DEFAULT_BASE_POSITION_Y, 0);
      conveyorGroup.add(base);
    }

    conveyorGroup.position.set(...DEFAULT_CONVEYOR_GROUP_POSITION);

    applyObjectParameters(conveyorGroup, params);
    if (!conveyorGroup.name) {
      conveyorGroup.name = FALLBACK_CONVEYOR_NAME;
    }

    return conveyorGroup;
  },
};

export default ConveyorFactory; 
