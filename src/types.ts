import { z } from "zod";

export interface Economy {
  value: number;
  reqExp: number;
  trainCost: number;
  train2Cost: number;
  train3Cost_gold: number;
  train3Cost_exp: number;
  repairTimeHrsArcade: number;
  repairTimeHrsHistorical: number;
  repairTimeHrsSimulation: number;
  repairTimeHrsNoCrewArcade: number;
  repairTimeHrsNoCrewHistorical: number;
  repairTimeHrsNoCrewSimulation: number;
  repairCostArcade: number;
  repairCostHistorical: number;
  repairCostSimulation: number;
  battleTimeAwardArcade: number;
  battleTimeAwardHistorical: number;
  battleTimeAwardSimulation: number;
  avgAwardArcade: number;
  avgAwardHistorical: number;
  avgAwardSimulation: number;
  timedAwardSimulation: number;
  rewardMulArcade: number;
  rewardMulHistorical: number;
  rewardMulSimulation: number;
  expMul: number;
  groundKillMul: number;
  battleTimeArcade: number;
  battleTimeHistorical: number;
  battleTimeSimulation: number;
  rank: number;
  economicRankArcade: number;
  economicRankHistorical: number;
  economicRankSimulation: number;
  country: CountryName;
  unitClass: string;
  spawnType: string;
  unitMoveType: string;
  speed: number;
  maxFlightTimeMinutes: number;
  commonWeaponImage: string;
  crewTotalCount: number;
  killStreak: boolean;
  gift: string;
  researchType?: "clanVehicle";
  event?: string;
  showOnlyWhenBought?: boolean;
  weaponmask: number;
  reloadTime_cannon: number;
  maxDeltaAngle_rockets: number;
  maxDeltaAngle_atgm: number;
  reloadTime_additionalGun: number;
  hasWeaponSlots: boolean;
  needBuyToOpenNextInTier1: number;
  needBuyToOpenNextInTier2: number;
  needBuyToOpenNextInTier3: number;
  needBuyToOpenNextInTier4: number;
  costGold?: number;
  freeRepairs: number;
  weapons: Record<string, unknown>;
  modifications: Record<string, unknown>;
  spare: Spare;
}

export const country = z.enum([
  "country_usa",
  "country_germany",
  "country_ussr",
  "country_britain",
  "country_japan",
  "country_china",
  "country_italy",
  "country_france",
  "country_sweden",
  "country_israel",
]);
export type CountryName = z.infer<typeof country>;

export interface Spare {
  value: number;
  costGold: number;
}

export interface BaseVehicle {
  model: string;
  type: string;
}

export interface ShipVehicle extends BaseVehicle {
  modifications: Record<string, GroundMod>;
  commonWeapons: CommonGroundWeapons;
}

export interface GroundVehicle extends BaseVehicle {
  hasExpl: boolean;
  hasDmg2: boolean;
  hasQualityModels: boolean;
  collisionSphere0: number[];
  collisionSphere1: number[];
  exhaustFx: string;
  damagedExhaustFx: string;
  thermalExhaustFx: string;
  dustFx: string;
  support_unit_class: string;
  support_unit_tag: string;
  useSimpleDeathConditionsAndEffects: boolean;
  autoSightDistanceCorrection: boolean;
  subclass: string;
  onRadarAs: string;
  moveType: string;
  maxFwdSpeed: number;
  maxRevSpeed: number;
  maxAngSpeed: number;
  maxAccel: number;
  maxDecel: number;
  maxAngAccel0: number;
  maxAngAccelV: number;
  maxAngAccel: number;
  groundNormSmoothViscosity: number;
  minDistBetween: number;
  expClass: string;
  mass: number;
  bulletHitFx: string;
  partDamageFx: string;
  explosionFx: string;
  fireFx: string;
  destroysRendInstances: boolean;
  destroysTrees: boolean;
  rearmSmokeTimeOnField: number;
  canReloadNonGuns: boolean;
  VehiclePhys?: VehiclePhys;
  sound: Sound;
  cockpit: GroundCockpit;
  modifications: Record<string, GroundMod>;
  gunConvergence: GunConvergence;
  commanderView?: CommanderView;
  DamageParts: DamageParts;
  commonWeapons: CommonGroundWeapons;
}

export interface CommanderView {
  aimModeAvailable: boolean;
  optics: string;
  zoomOutFov: number;
  zoomInFov: number;
  sightSize: number[];
}

export interface CommonGroundWeapons {
  Weapon: WeaponGround[] | WeaponGround;
}

export interface WeaponGround {
  dummy: boolean;
  trigger: string;
  blk: string;
  emitter: string;
  flash?: string;
  sleeveEmitter?: string;
  sleeveMesh?: string;
  hatchAnimVar?: string;
  openHatchTime?: number;
  sleevesLifeTime?: number;
  sleeveImpulse?: number[];
  sleevesImpulseOffset?: number;
  sleeveExtractSound?: string;
  recoilOffset?: number;
  recoilMultiplier?: number;
  defaultYaw: number;
  defaultPitch: number;
  barrelDP?: string;
  breechDP?: string;
  autoLoader?: boolean;
  speedYaw: number;
  speedPitch: number;
  fireConeAngle?: number[] | number;
  bullets?: number;
  reloadTime?: number;
  changeBulletTypeReloadTime?: number;
  bulletsCartridge?: number;
  salvoAmount?: number;
  ChainfireTime?: number;
  DelayAfterShoot?: number;
  AttackMaxDistance?: number;
  AttackMaxRadius?: number;
  AttackMaxHeight?: number;
  accuracyAir?: number;
  accuracyGnd?: number;
  errMeasureVel?: number;
  errMeasureVelFast?: number;
  errMeasureVelFwdShift?: number;
  errMeasureVelDir?: number;
  errTargettingOn100kmph?: number;
  errTargetting?: number;
  errExplTime?: number;
  turret: Turret;
  limits: Limits;
  limitsTable?: LimitsTable;
  gunStabilizer?: GunStabilizer;
  triggerGroup?: string;
  parkInDeadzone?: boolean;
  isBulletBelt?: boolean;
  overheat?: Overheat;
}

export interface Overheat {
  overheat: number[][];
}

export interface GunStabilizer {
  hasVerticalGunFreeMode: boolean;
  hasHorizontal: boolean;
  horizontalOmegaMult: number;
  horizontalSpeedLimitKPH: number;
  hasVertical: boolean;
  verticalOmegaMult: number;
  verticalSpeedLimitKPH: number;
  speedFromVehicleVerticalMult: number;
  errorKPHToDegrees: ErrorKPHToDegrees;
  forceEnabled?: boolean;
}

export interface ErrorKPHToDegrees {
  row: Array<number[]>;
}

export interface Limits {
  yaw: number[];
  pitch: number[];
}

export interface LimitsTable {
  lim1: number[];
  lim2: number[];
  lim3: number[];
}

export interface Turret {
  head: string;
  gun: string;
  barrel?: string;
  gunnerDm: string;
  secondGunnerDm?: string;
  verDriveDm?: string;
  horDriveDm?: string;
}

export interface GameBaseMod {
  tier?: number;
  prevModification?: string;
  modClass?: string;
  invertEnableLogic?: string;
  deactivationIsAllowed?: boolean;
  reqModification?: string;
}

export interface GroundMod extends GameBaseMod {
  maxToRespawn?: number;
  effects?: {
    nightVision?: {
      commanderViewThermal?: {
        resolution: [500 | 800 | 1200, 300 | 600 | 800];
        noiseFactor: 0.05 | 0.04;
      };
      gunnerThermal?: {
        resolution: [500 | 800 | 1200, 300 | 600 | 800];
        noiseFactor: 0.05 | 0.04;
      };
      commanderViewIr?: {
        resolution: [800 | 1600, 600 | 1200];
        lightMult: 5.0 | 8 | 9;
        ghosting: 0.7 | 0.75 | 0.6;
        noiseFactor: 0.2;
      };
      driverIr?: {
        resolution: [800 | 1600, 600 | 1200];
        lightMult: 5.0 | 8 | 9;
        ghosting: 0.7 | 0.75 | 0.6;
        noiseFactor: 0.2;
      };
      gunnerIr?: {
        resolution: [800 | 1600, 600 | 1200];
        lightMult: 5.0 | 8 | 9;
        ghosting: 0.7 | 0.75 | 0.6;
        noiseFactor: 0.2;
      };
    };
  };
}

export interface Mechanics {
  maxBrakeForce: number;
  driveGearRadius: number;
  mainGearRatio: number;
  sideGearRatio: number;
  neutralGearRatio?: number;
  gearRatios: GearRatios;
}

export interface GearRatios {
  ratio: number[];
}

export interface DamageParts {
  formatVersion: number;
  armorClass: string;
  hp: number;
  hull: Hull;
  turret: Turret;
  hull_turret_ex_shields: HullTurretExShields;
  tank_structural_steel_elements: TankStructuralSteelElements;
  mask: Mask;
  optics: Optics;
  chassis: Chassis;
  gun: Gun;
  tracks: Tracks;
  crew: Crew;
  equipment_body_turret: EquipmentBodyTurret;
  cannon_breech: CannonBreech;
  power_block: PowerBlock;
  ammo: Ammo;
  fuel_tanks: FuelTanks;
  fuel_tanks_exterior: FuelTanksExterior;
  commander_panoramic_sight: CommanderPanoramicSight;
  era_side_box: Era;
  era_hull: Era;
  era_turret: Era;
  era_turret_top: Era;
  era_turret_front_box: Era;
  era_turret_front_plate: Era;
  ufp_era: Era;
  front_turret_era: Era;
  side_turret_era: Era;
  top_turret_era: Era;
}

export interface Era {
  armorClass: string;
  kineticProtectionEquivalent: number;
  cumulativeProtectionEquivalent: number;
  hp: number;
  armorThickness: number;
  genericDamageMult: number;
  cumulativeArmorQuality: number;
  armorEffectiveThicknessMax: number;
  stopChanceOnDeadPart: number;
  hidableInViewer: boolean;
}

export interface Ammo {
  armorClass: string;
  hp: number;
  armorThickness: number;
  armorThrough: number;
  fireProtectionHp: number;
  createSecondaryShatters: boolean;
}

export interface CannonBreech {
  armorClass: string;
  hp: number;
  armorThickness: number;
  fireProtectionHp: number;
  hidableInViewer: boolean;
  cannon_breech_dm: CannonBreechDm;
  cannon_breech_01_dm: CannonBreech0__Dm;
  cannon_breech_02_dm: CannonBreech0__Dm;
  cannon_breech_03_dm: CannonBreech0__Dm;
  cannon_breech_04_dm: CannonBreech0__Dm;
  cannon_breech_05_dm: CannonBreech0__Dm;
}

export interface CannonBreech0__Dm {
  armorThickness: number;
  armorThrough: number;
}

export interface CannonBreechDm {
  restrainDamage: number;
  armorThrough: number;
}

export interface Chassis {
  armorClass: string;
  hp: number;
  armorThickness: number;
  submodule: Submodule;
}

export interface Submodule {
  armorClass: string;
  armorThickness: number;
  hp: number;
}

export interface CommanderPanoramicSight {
  commander_panoramic_sight_dm: CommanderPanoramicSightDmClass;
}

export interface CommanderPanoramicSightDmClass {
  armorClass?: string;
  armorThrough: number;
  armorThickness: number;
  hp: number;
}

export interface Crew {
  armorClass: string;
  hp: number;
  genericDamageMult: number;
  pressureDamageMult: number;
  napalmDamageMult: number;
  ignoreSolidDimension: boolean;
}

export interface EquipmentBodyTurret {
  armorClass: string;
  hp: number;
  armorThrough: number;
  fireProtectionHp: number;
  hidableInViewer: boolean;
  drive_turret_v_dm: DriveTurretDm;
  drive_turret_h_dm: DriveTurretDm;
  drive_turret_v_01_dm: DriveTurretH01_DmClass;
  drive_turret_h_01_dm: DriveTurretH01_DmClass;
  drive_turret_v_02_dm: DriveTurretH01_DmClass;
  drive_turret_h_02_dm: DriveTurretH01_DmClass;
  drive_turret_v_03_dm: DriveTurretH01_DmClass;
  drive_turret_h_03_dm: DriveTurretH01_DmClass;
  drive_turret_v_04_dm: DriveTurretH01_DmClass;
  drive_turret_h_04_dm: DriveTurretH01_DmClass;
  drive_turret_v_05_dm: DriveTurretH01_DmClass;
  drive_turret_h_05_dm: DriveTurretH01_DmClass;
  radiator_dm: DriveTurretH01_DmClass;
  radiator_l_dm: DriveTurretH01_DmClass;
  radiator_r_dm: DriveTurretH01_DmClass;
  radio_station_dm: DriveTurretH01_DmClass;
  radio_station_01_dm: DriveTurretH01_DmClass;
}

export interface DriveTurretH01_DmClass {
  hp: number;
  armorThrough: number;
}

export interface DriveTurretDm {
  armorThrough: number;
}

export interface FuelTanks {
  armorClass: string;
  hp: number;
  armorThickness: number;
  armorThrough: number;
  fireProtectionHp: number;
  createSecondaryShatters: boolean;
  fireParamsPreset: string;
  stopChanceOnDeadPart: number;
}

export interface FuelTanksExterior {
  armorClass: string;
  hp: number;
  armorThickness: number;
  armorThrough: number;
  fireProtectionHp: number;
  createSecondaryShatters: boolean;
  fireParamsPreset: string;
}

export interface Gun {
  armorClass: string;
  hp: number;
  armorThickness: number;
  gun_barrel_01_dm: CommanderPanoramicSightDmClass;
  gun_barrel_02_dm: CommanderPanoramicSightDmClass;
  gun_barrel_03_dm: CommanderPanoramicSightDmClass;
  gun_barrel_04_dm: CommanderPanoramicSightDmClass;
  gun_barrel_05_dm: CommanderPanoramicSightDmClass;
}

export interface Hull {
  body_front_dm: Armour;
  superstructure_front_dm: Armour;
  body_top_dm: Armour;
  body_back_dm: Armour;
  body_side_dm: Armour;
  superstructure_top_dm: Armour;
  superstructure_bottom_dm: Armour;
  superstructure_back_dm: Armour;
  body_bottom_dm: Armour;
  turret_01_bottom_dm: Armour;
  turret_01_front_dm: Armour;
  turret_01_side_dm: Armour;
  superstructure_side_dm: Armour;
  turret_02_back_dm: Turret02___Dm;
  turret_02_bottom_dm: Turret02___Dm;
  turret_02_front_dm: Turret02___Dm;
  turret_03_bottom_dm: Armour;
}

export interface Armour {
  armorThickness: number;
}

export interface Turret02___Dm {
  armorThickness: number;
  armorEffectiveThicknessMax: number;
}

export interface HullTurretExShields {
  armorClass: string;
  hidableInViewer: boolean;
  hp: number;
  ex_armor_turret_01_dm: Armour;
  ex_armor_turret_r_01_dm: Armour;
  ex_armor_turret_r_02_dm: Armour;
  ex_armor_turret_l_01_dm: Armour;
  ex_armor_turret_l_02_dm: Armour;
}

export interface Mask {
  armorClass: string;
  gun_barrel_armor_dm: Armour;
  turret_commander_dm: Armour;
  turret_02_side_dm: Armour;
  mg_twin_armor_dm: Armour;
  gun_mask_02_dm: Armour;
}

export interface Optics {
  armorClass: string;
  optic_gun_dm: OpticDm;
  optic_turret_01_dm: OpticDm;
  optic_turret_02_dm: OpticDm;
  optic_turret_03_dm: OpticDm;
  optic_turret_04_dm: OpticDm;
  optic_turret_05_dm: OpticDm;
  optic_turret_06_dm: OpticDm;
  optic_turret_07_dm: OpticDm;
  optic_turret_08_dm: OpticDm;
  optic_turret_09_dm: OpticDm;
  optic_turret_10_dm: OpticDm;
  optic_turret_11_dm: OpticDm;
  optic_body_01_dm: OpticDm;
}

export interface OpticDm {
  armorThickness: number;
  hp: number;
}

export interface PowerBlock {
  armorClass: string;
  hp: number;
  armorThickness: number;
  fireProtectionHp: number;
  restrainDamage: number;
}

export interface TankStructuralSteelElements {
  armorClass: string;
  armorThickness: number;
  hp: number;
  stopChanceOnDeadPart: number;
  createSecondaryShatters: boolean;
}

export interface Tracks {
  armorClass: string;
  allowRicochet: boolean;
  armorThickness: number;
  armorEffectiveThicknessMax: number;
  hp: number;
  genericEffectiveThicknessMax: number;
  genericDamageMult: number;
  cumulativeDamageMult: number;
}

export interface Turret {
  turret_top_dm: Armour;
  turret_side_dm: Armour;
  turret_front_dm: Armour;
  gun_mask_dm: Armour;
  gun_mask_01_dm: Armour;
  turret_bottom_dm: Armour;
  turret_back_dm: Armour;
}

export interface VehiclePhys {
  Mass: Mass;
  tracks: VehiclePhysTracks;
  engine: Engine;
  mechanics: Mechanics;
  movableSuspension?: MovableSuspension;
  floats?: Floats;
}

export interface Floats {
  volume: number[];
  waterJet: Record<string, unknown>[];
}

export interface MovableSuspension {
  speed: number;
  maxSpeedForMove: number;
}

export interface Engine {
  horsePowers: number;
  maxRPM: number;
  minRPM: number;
}

export interface VehiclePhysTracks {
  animationMultiplier: number;
  tracksTensionK: number[];
  trackMesh: string;
  trackLen: number;
  trackCount: number;
  trackFadeTime: number;
  trackConnector: boolean;
  trackEmitSparks: boolean;
  trackMaxHeight: number;
  trackStartOffset: number;
  height: number;
  width: number;
  trackMaxSinking: number;
}

export interface Mass {
  Empty: number;
  Fuel: number;
  TakeOff: number;
  momentOfInertia: number[];
  CenterOfGravity: number[];
  CenterOfGravityClampY: number[];
  AdvancedMass: boolean;
  trackMass: number;
}

export interface Sound {
  EngineName: string;
  TrackSoundPath: string;
  TrackSoundPathStudio: string;
  TrackSoundName: string;
  TrackSoundNameCockpit: string;
  EngineNameAi: string;
  TrackSoundNameAi: string;
  gun_turn: string;
}

export interface GunConvergence {
  updateFromRangefinder: boolean;
  minDistance: number;
  defaultDistance: number;
  vertical: boolean;
  horizontal: boolean;
}

export interface GroundCockpit {
  zoomOutFov: number;
  zoomInFov: number;
  sightFov: number;
  sightName: string;
  headPos: number[];
  headPosOnShooting: number[];
  detectionHeight: number;
  bone_turret: string;
}

export interface AirVehicle extends BaseVehicle {
  fmFile: string;
  MetaPartsBlk: string;
  exhaustEffectsBlk: string;
  paratrooper: string;
  flapsIsAirbrakes: boolean;
  overheatBlk: string;
  damagePartsToCollisionObjectsMapBlk: string;
  damagePartsToFmPartsMapBlk: string;
  damagePartsToHudPartsMapBlk: string;
  damagePartsDependencyMapBlk: string;
  damagePartsToCollisionPointsMapBlk: string;
  damagePartsToWeaponsMapBlk: string;
  damagePartsToVisualEffectsMapBlk: string;
  damagePartsExcludeFromHoleBlk: string;
  explosion_dmBlk: string;
  fireParamsPreset: string;
  fightAiBehaviour: string;
  haveCCIPForRocket?: boolean;
  haveCCIPForBombs?: boolean;
  haveCCIPForGun?: boolean;
  haveCCRPForBombs?: boolean;
  cockpit: Cockpit;
  modifications?: Record<string, AirMod>;
  sensors?: Sensors;
  counterMeasures?: counterMeasures;
  ikPilot: IkPilot;
  attach: Attach;
  Sound: Sound;
  Params: Params;
  propellers: Propellers;
  commonWeapons: CommonWeapons;
  weapon_presets: WeaponPresets;
  WeaponSlots?: WeaponSlots;
  jetwash: Jetwash;
  turbulence: Turbulence;
  fireParams: FireParams;
  wiki: Wiki;
  balanceData: BalanceData;
  user_skin: UserSkin;
}

export interface AirMod extends GameBaseMod {
  effects?: {
    nightVision?: {
      sightThermal?: {
        resolution: [1024, 768];
        noiseFactor: 0.5 | 0.05;
      };
      pilotIr?: {
        resolution: number[];
        lightMult: number;
        ghosting: number;
        noiseFactor: number;
      };
      gunnerIr?: {
        resolution: number[];
        lightMult: number;
        ghosting: number;
        noiseFactor: number;
      };
    };
    counterMeasures?: counterMeasures;
    sensors?: Sensors;
  };
}

export interface Sensors {
  sensor: VehicleSensor | VehicleSensor[];
}

export interface VehicleSensor {
  blk: string;
  dmPart?: string;
  node?: string;
}

export interface counterMeasures {
  counterMeasure: VehicleSensor | VehicleSensor[];
}

// Sensors
export interface Sensor {
  type: string;
  name: string;
  range: number;
  band0: boolean;
  band1: boolean;
  band2: boolean;
}

export interface WeaponSlots {
  maxloadMass: number;
  maxloadMassLeftConsoles: number;
  maxloadMassRightConsoles: number;
  maxDisbalance: number;
  WeaponSlot: WeaponSlot[];
}

export interface WeaponSlot {
  index: number;
  tier?: number;
  order?: number;
  notUseforDisbalanceCalculation?: boolean;
  WeaponPreset?: Array<WeaponPreset | WeaponNamePreset> | WeaponPreset | WeaponNamePreset;
}

export interface WeaponNamePreset {
  name: string;
}

export interface WeaponPreset {
  name: string;
  iconType: string;
  showInWeaponMenu?: boolean;
  reqModification?: string | string[];
  hasTargetingPod?: boolean;
  ShowNodes: {
    node: string[] | string;
  };
  ShowDmParts?: {
    node: string[] | string;
  };
  HideNodes?: {
    node: string[] | string;
  };
  Weapon:
    | CounterMeasure
    | Cannon
    | Cannon[]
    | Bomb
    | Rocket
    | Missile
    | AircraftOptics
    | TargetingPod
    | Booster;
  DependentWeaponPreset?: { slot: number; preset: string };
  BannedWeaponPreset?: { slot: number; preset: string };
}

export interface CounterMeasure {
  trigger: "countermeasures";
  startFx: string;
  blk: string;
  emitter: string;
  external: boolean;
  separate: boolean;
}

export interface Bomb {
  trigger: "bombs" | "torpedoes";
  blk: string;
  emitter: string;
  bullets: number;
  external: boolean;
  separate?: boolean;
  machLimit: number;
}

export interface Rocket {
  trigger: "rockets";
  blk: string;
  emitter: string;
  external: boolean;
  machLimit: number;
}

export interface Cannon {
  trigger: string;
  blk: string;
  emitter: string;
  flash: string;
  dm: string;
  shell: string;
  bullets: number | number[];
  spread: number;
  traceOffset: number;
  counterIndex: number;
  external: boolean;
  gearLimit: number[];
  gearName: string;
  rotationAnimScale: string;
}

export interface Missile {
  trigger: "aam" | "atgm" | "guided bombs" | "fuel tanks";
  blk: string;
  emitter: string;
  bullets?: number;
  external: boolean;
  separate: boolean;
}

export interface AircraftOptics {
  dummy?: boolean;
  trigger: "gunner0" | "gunner1";
  triggerGroup?: string;
  blk: string;
  breechInCockpit?: boolean;
  invertedLimitsInViewer?: boolean;
  emitter: string;
  flash?: string;
  dm?: string;
  gunnerDm?: string;
  gunDm?: string;
  partsDP?: string;
  bullets?: number;
  defaultYaw?: number;
  defaultPitch?: number;
  speedYaw?: number;
  speedPitch?: number;
  parkInDeadzone?: boolean;
  aimForOperatedShell?: boolean;
  turret: { head: string; gun: string; mainTurret?: boolean };
  limits: { yaw: number[]; pitch: number[] };
}

export interface TargetingPod {
  trigger: "targetingPod";
  blk: string;
  emitter: string;
  bullets: number;
  dragCx: number;
}

export interface Booster {
  trigger: "boosters";
  blk: string;
  emitter: string;
  bullets: number;
  external?: boolean;
  gearRange?: number[];
  airbrakeRange?: number[];
}

export type Container = RocketContainer | BombContainer | CannonContainer;

export interface RocketContainer {
  container: boolean;
  mesh: string;
  useEmitter: boolean;
  emitterGenRange: number[];
  emitterGenFmt: string;
  cap: string;
  blk: string;
  bullets: number;
  amountPerTier: number;
  mass: number;
  dragCx: number;
  brokenCaps: {
    brokenCap: string[];
  };
}

export interface BombContainer {
  container: boolean;
  mesh: string;
  useEmitter: boolean;
  emitter: string[];
  blk: string;
  bullets: number;
  amountPerTier: number;
}

export interface CannonContainer {
  cannon: boolean;
  weaponType: number;
  bUseHookAsRel: boolean;
  emitColor: number[];
  emitI: number;
  emitR: number;
  emitTime: number;
  aimMinDist: number;
  aimMaxDist: number;
  maxDeltaAngle: number;
  shotFreq: number;
  alternativeShotFreq: number;
  traceFreq: number;
  bEnablePause: boolean;
  bullets: number;
  bulletsCluster: number;
  mass: number;
  dragCx: number;
  shouldCollideWithRendinsts: boolean;
  fxType: string;
  fxMultipleSpawn: boolean;
  iconType: string;
  bullet: CannonContainerBullet[];
  gunSound: GunSound;
}

export interface CannonContainerBullet {
  mass: number;
  caliber: number;
  explosiveType?: string;
  explosiveMass?: number;
  speed: number;
  maxDistance: number;
  Cx: number;
  selfDestructionInAir?: boolean;
  normalizationPreset: string;
  ricochetPreset: string;
  secondaryShattersPreset: string;
  stabilityThreshold: number;
  stabilityCaliberToArmorThreshold: number;
  stabilityReductionAfterRicochet: number;
  stabilityReductionAfterPenetration: number;
  bulletType: string;
  slopeEffectPreset?: string;
  fresnel?: number[];
  explodeOnRendinst?: boolean;
  shellAnimation: string;
  recoilMultiplier: number;
  hitPowerMult?: number;
  nearHitPower?: number[];
  midHitPower?: number[];
  farHitPower?: number[];
  endHitPower?: number[];
  relativeVelHitShift: number[];
  nearArmorPower?: number[];
  midArmorPower?: number[];
  farArmorPower?: number[];
  relativeVelArmorShift: Array<number[] | number>;
  fuseDelayDist?: number;
  explodeTreshold?: number;
  explodeHitPower?: number;
  explodeArmorPower?: number;
  explodeRadius?: number[];
  shutterDamage?: boolean;
  shutterDamageRadius?: number;
  shutterAmount?: number;
  shutterArmorPower?: number;
  shutterHit?: number;
  selfDestructionFx: string;
  explosionEffect: string;
  groundCollisionEffect: string;
  ricochetEffect: string;
  waterCollisionEffect: string;
  explosionPatchRadius?: number;
  stabilityRicochetModifier: StabilityRicochetModifier;
  visual: Visual;
  collisions: { [key: string]: Collision };
  modelName?: string;
  onHitChanceMultFire?: number;
  hitpower?: Hitpower;
  damage?: Damage;
  effectiveDistance?: number;
  armorpower?: Armorpower;
}

export interface Armorpower {
  ArmorPower0m: number[];
  ArmorPower100m: number[];
  ArmorPower500m: number[];
  ArmorPower1000m: number[];
  ArmorPower1450m: number[];
  ArmorPower1500m: number[];
}

export interface Collision {
  fx: string;
}

export interface Damage {
  kinetic: Kinetic;
}

export interface Kinetic {
  damageType: string;
  demarrePenetrationK: number;
  demarreSpeedPow: number;
  demarreMassPow: number;
  demarreCaliberPow: number;
}

export interface Hitpower {
  HitPower0m?: number[];
  HitPower1000m: number[];
  HitPower10000m?: number[];
  HitPower10m?: number[];
  HitPower1500m?: number[];
  HitPower2000m?: number[];
}

export interface StabilityRicochetModifier {
  mod1: number[];
  mod2: number[];
  mod3: Array<number[]>;
}

export interface GunSound {
  path: string;
  pathStudio: string;
  outside: string;
  cockpit: string;
  ai: string;
}

export interface Ns23ArmorTargetsBullet {
  mass: number;
  caliber: number;
  explosiveType?: string;
  explosiveMass?: number;
  speed: number;
  maxDistance: number;
  Cx: number;
  selfDestructionInAir?: boolean;
  normalizationPreset: string;
  ricochetPreset: string;
  secondaryShattersPreset: string;
  stabilityThreshold: number;
  stabilityCaliberToArmorThreshold: number;
  stabilityReductionAfterRicochet: number;
  stabilityReductionAfterPenetration: number;
  bulletType: string;
  slopeEffectPreset?: string;
  fresnel?: number[];
  explodeOnRendinst?: boolean;
  shellAnimation: string;
  recoilMultiplier: number;
  hitPowerMult?: number;
  effectiveDistance?: number;
  relativeVelHitShift: number[];
  relativeVelArmorShift: Array<number[] | number>;
  nearArmorPower?: number[];
  midArmorPower?: number[];
  farArmorPower?: number[];
  fuseDelayDist?: number;
  explodeTreshold?: number;
  explodeHitPower?: number;
  explodeArmorPower?: number;
  explodeRadius?: number[];
  shutterDamage?: boolean;
  shutterDamageRadius?: number;
  shutterAmount?: number;
  shutterArmorPower?: number;
  shutterHit?: number;
  selfDestructionFx: string;
  explosionEffect: string;
  groundCollisionEffect: string;
  ricochetEffect: string;
  waterCollisionEffect: string;
  stabilityRicochetModifier: StabilityRicochetModifier;
  hitpower: Hitpower;
  armorpower?: Armorpower;
  visual: Visual;
  collisions: { [key: string]: Collision };
  modelName?: string;
  onHitChanceMultFire?: number;
  damage?: Damage;
}

export interface Overheat {
  overheat: Array<number[]>;
}

export interface OnHitPart {
  ratio: number;
  canCut: boolean;
}

export interface OnHitClass {
  leak_oil: number;
}

export interface OnKillClass {
  cut?: number;
  leak_oil?: number;
  nothing?: number;
}

export interface Params {
  Range: number;
}

export interface Sound {
  Engine: string;
  EngineAi: string;
  gun: string;
  jetSound: boolean;
}

export interface Attach {
  pilot1: string;
}

export interface BalanceData {
  accSpd: number;
  climbSpeed: number;
  maxSpeed: number;
  turnTime: number;
}

export interface Cockpit {
  sightOutFov?: number;
  sightInFov?: number;
  headPos: number[];
  headPosOnShooting: number[];
  lightPos: number[];
  lightColor: number[];
  lightAttenuation: number;
  devices: Devices;
  parts_holes_dmg: PartsHolesDmg;
  parts_oil_dmg: PartsOilDmg;
}

export interface Devices {
  pedals: number[];
  pedals1: number[];
  pedals2: number[];
  stick_ailerons: number[];
  stick_elevator: number[];
  throttle: number[];
  flaps: number[];
  flaps_fixed: boolean;
  gears: number[];
  gears1: number[];
  trimmer: number[];
  weapon2: number[];
  weapon3: number[];
  gears_lamp: number[];
  compass: number[];
  compass1: number[];
  bank: number[];
  turn: number[];
  aviahorizon_pitch: number[];
  aviahorizon_roll: number[];
  oil_temperature: number[];
  oil_pressure: number[];
  oil_pressure1: number[];
  fuel_pressure: number[];
  water_temperature: number[];
  rpm_hour: number[];
  rpm_min: number[];
  fuel: number[];
  fuel1: number[];
  fuel2: number[];
  mach: number[];
  altitude_10k: number[];
  altitude_hour: number[];
  altitude_min: number[];
  altitude_koef: number;
  speed: number[];
  vario: number[];
}

export interface PartsHolesDmg {
  part: string;
}

export interface PartsOilDmg {
  part: string[];
}

export interface CommonWeapons {
  Weapon: CommonWeapon[];
}

export interface CommonWeapon {
  trigger: string;
  blk: string;
  emitter: string;
  flash: string;
  shell: string;
  dm: string;
  bullets: number;
  spread: number;
  isWingLPositioned?: boolean;
  isWingRPositioned?: boolean;
  traceOffset?: number;
}

export interface FireParams {
  engineExtinguishFireSpeed: number[];
  engineExtinguishFireSpeedChance: number[];
  fireDamagePowerRel: number;
  nonExtinguishFireTime: number;
}

export interface IkPilot {
  model: string;
  maxHeadHorAngle: number;
  maxHeadDownAngle: number;
  maxHeadUpAngle: number;
  headNode: string;
  pelvisNode: string;
  pelvisTargetNode: string;
  ikNode: IkNode[];
}

export interface IkNode {
  downNode: string;
  midNode: string;
  upNode: string;
  targetNode: string;
  flexionDir: number[];
  type?: string;
  detachedNodeYpr?: number[];
  detachedNodeScale?: number[];
}

export interface Jetwash {
  radius: number;
  minDist: number;
  timeToLive: number;
  maxPower: number;
  maxSegments: number;
}

export interface BlackburnTc {
  modClass: string;
  tier: number;
  reqModification: string;
}

export interface Halker {
  modClass: string;
  tier: number;
}

export interface HispanoBeltPack {
  tier: number;
}

export interface HispanoMk5NewGun {
  reqModification: string;
  tier: number;
}

export interface Propellers {
  prop1Engine: number;
  prop2Engine: number;
}

export interface Turbulence {
  segmentlength: number;
  startSpeed: number;
  maxSpeed: number;
  maxPower: number;
  initialRadius: number;
  radiusSpeed: number;
}

export interface UserSkin {
  name: string;
  replace_tex: ReplaceTex[];
}

export interface ReplaceTex {
  from: string;
}

export interface WeaponPresets {
  preset: Preset[];
}

export interface Preset {
  name: string;
  blk: string;
  reqModification?: string[] | string;
}

export interface Wiki {
  general: General;
  performance: Performance;
}

export interface General {
  length: number;
  wingspan: number;
  wingArea: number;
  emptyWeight: number;
  normalWeight: number;
  maxTakeoffWeight: number;
  powerPlantType: number;
  thrustMaxWep: number;
  thrustMaxMil: number;
}

export interface Performance {
  table: Table;
  plot: Plot;
}

export interface Plot {
  airSpeedWep0: number[];
  airSpeedWep1: number[];
  climbRateWep0: number[];
  climbRateWep1: number[];
  airSpeedMil0: number[];
  airSpeedMil1: number[];
  climbRateMil0: number[];
  climbRateMil1: number[];
}

export interface Table {
  rpmWep: number;
  airSpeedWep0: number[];
  climbRateWep0: number[];
  turnTimeWep: number[];
  rpmMil: number;
  airSpeedMil0: number[];
  climbRateMil0: number[];
  turnTimeMil: number[];
  takeoffDistance: number;
  ceiling: number;
  rollRate: number;
  wingLoading: number;
  thrustToWeightRatio: number;
}

//UnitData
export interface UnitData {
  type: HangarPlace;
  hangar_place: HangarPlace;
  testFlight: string;
  releaseDate: string;
  info: Info;
  tags: Tags;
  Shop?: UnitShop;
  operatorCountry?: string;
}

export interface UnitShop {
  maxAltitude?: number;
  maxSpeed?: number;
  turnTime?: number;
  airfieldLen?: number;
  maxSpeedAlt?: number;
  climbSpeed?: number;
  climbTime?: number;
  climbAlt?: number;
  wingLoading?: number;
  powerToWeightRatio?: number;
  rollRate?: number;
  thrustToWeightRatio?: number;
  armorThicknessHull?: number[];
  armorThicknessTurret?: number[];
  armorThicknessCumulativeTurret?: number[];
  armorThicknessCumulativeHull?: number[];
  armorThicknessCitadel?: number[];
  armorThicknessTurretMainCaliber?: number[];
  displacement?: number;
  atProtection?: number;
}

export enum HangarPlace {
  Aircraft = "aircraft",
  Helicopter = "helicopter",
  Hydroplane = "hydroplane",
  Ship = "ship",
  Tank = "tank",
}

export interface Info {
  engine1_dm: Engine1Dm;
  tanks_params: TanksParams;
}

export interface Engine1Dm {
  manufacturer: string;
  model: string;
  mass: number;
}

export interface TanksParams {
  protected_boost?: boolean;
  tank1_dm?: TankDm;
  tank2_dm?: TankDm;
  tank3_dm?: TankDm;
  tank4_dm?: TankDm;
  tank5_dm?: TankDm;
  protected?: boolean;
}

export interface TankDm {
  protected: boolean;
}

export interface Tags {
  ally?: boolean;
  country_france?: boolean;
  country_ussr?: boolean;
  type_light_tank?: boolean;
  type_fighter?: boolean;
  type_naval_aircraft?: boolean;
  type_torpedo?: boolean;
  carrier_take_off?: boolean;
  western_front?: boolean;
  air?: boolean;
  tank?: boolean;
  country_china?: boolean;
  type_attack_helicopter?: boolean;
  type_utility_helicopter?: boolean;
  country_germany?: boolean;
  type_spaa?: boolean;
  type_tank_destroyer?: boolean;
  scout?: boolean;
  canRepairAnyAlly?: boolean;
  type_missile_tank?: boolean;
  axis?: boolean;
  type_jet_fighter?: boolean;
  berlin?: boolean;
  eastern_front?: boolean;
  type_bomber?: boolean;
  type_jet_bomber?: boolean;
  bomberview?: boolean;
  country_britain?: boolean;
  type_assault?: boolean;
  type_strike_aircraft?: boolean;
  country_japan?: boolean;
  pacific?: boolean;
  far_eastern_front?: boolean;
  mediterranean?: boolean;
  type_medium_tank?: boolean;
  country_usa?: boolean;
  has_proximityFuse_rocket?: boolean;
  country_sweden?: boolean;
  country_italy?: boolean;
  country_israel?: boolean;
  airfield_take_off_air_rb?: boolean;
  hideBrForVehicle?: boolean;
  airfield_take_off?: boolean;
  type_longrange_bomber?: boolean;
  not_in_dynamic_campaign?: boolean;
  type_frontline_bomber?: boolean;
  korsun?: boolean;
  sicily?: boolean;
  has_aps?: boolean;
  type_heavy_tank?: boolean;
  cannot_takeoff?: boolean;
  type_hydroplane?: boolean;
  type_dive_bomber?: boolean;
  type_interceptor?: boolean;
  type_aa_fighter?: boolean;
  type_light_bomber?: boolean;
  type_battlecruiser?: boolean;
  type_battleship?: boolean;
  type_frigate?: boolean;
  type_light_cruiser?: boolean;
  type_heavy_cruiser?: boolean;
  type_destroyer?: boolean;
  type_barge?: boolean;
  type_boat?: boolean;
  type_heavy_boat?: boolean;
  type_armored_boat?: boolean;
  type_torpedo_boat?: boolean;
  type_gun_boat?: boolean;
  type_naval_ferry_barge?: boolean;
  type_naval_aa_ferry?: boolean;
  type_torpedo_gun_boat?: boolean;
  type_minelayer?: boolean;
  type_submarine_chaser?: boolean;
  type_strike_ucav?: boolean;
}

//groundmodels_weapons
export type Weapon = {
  cannon: boolean;
  weaponType: number;
  bUseHookAsRel: boolean;
  emitColor: number[];
  emitI: number;
  emitR: number;
  emitTime: number;
  aimMinDist: number;
  aimMaxDist: number;
  maxDeltaAngle: number;
  maxDeltaAngleVertical: number;
  shotFreq: number;
  traceFreq: number;
  bEnablePause: boolean;
  bullets: number;
  bulletsCluster: number;
  fxType: string;
  fxGroundDust: string;
  fxGrassDust: string;
  fxSandDust: string;
  fxSnowDust: string;
  fxConcreteDust: string;
  fxWaterShockWave: string;
  shouldCollideWithRendinsts: boolean;
  sound_path: string;
  sound_pathStudio: string;
  sound: string;
  sound_inside: string;
  sfxReloadBullet: string;
  fxMultipleSpawn: boolean;
  isBulletBelt: boolean;
  notUseDefaultBulletInGui: boolean;
  bulletsCartridge?: number;
  bullet: Bullet[] | Bullet;
} & {
  [key: string]: BulletContainer;
};

export interface BulletContainer {
  bulletsCartridge?: number;
  bullet: Bullet[] | Bullet;
}

export interface Bullet {
  bulletCount: number;
  mass: number;
  caliber: number;
  damageCaliber: number;
  ballisticCaliber: number;
  speed: number;
  Cx: number;
  maxDistance: number;
  normalizationPreset: string;
  ricochetPreset: string;
  secondaryShattersPreset: string;
  bulletType: string;
  slopeEffectPreset: string;
  fresnel: number[];
  shellAnimation: string;
  bulletName?: string;
  onHitChanceMultExplFuel: number;
  relativeVelHitShift: number[];
  relativeVelArmorShift: number[];
  selfDestructionFx: string;
  explosionEffect: string;
  groundCollisionEffect: string;
  ricochetEffect: string;
  waterCollisionEffect: string;
  explosionPatchRadius: number;
  stability: Stability;
  DamageParts: DamageParts;
  DamageEffects: DamageEffects;
  tracePattern: TracePattern;
  hitpower: PurpleHitpower;
  armorpower: { [key: string]: number[] };
  visual: Visual;
  ballistics?: Ballistics;
}

export interface DamageEffects {
  part: Part;
}

export interface Part {
  name: string;
  onKill: OnKill;
}

export interface OnKill {
  destabilization: number;
  impulse: number;
}

export interface DamageParts {
  body: Body;
}

export interface Body {
  hp: number;
  armorClass: string;
  armorThickness: number;
}

export interface Ballistics {
  slopeEffect: SlopeEffect;
}

export interface SlopeEffect {
  table: Table;
}

export interface Table {
  t1: T1;
}

export interface T1 {
  caliberToArmor: number;
  slopeEffect0deg: number[];
  slopeEffect10deg: number[];
  slopeEffect20deg: number[];
  slopeEffect30deg: number[];
  slopeEffect50deg: number[];
  slopeEffect70deg: number[];
  slopeEffect90deg: number[];
}

export interface PurpleHitpower {
  HitPower0m: number[];
  HitPower10000m: number[];
}

export interface Stability {
  precessionDamping: number;
  ricochetAnglePrecessionFactor: number;
  ricochetAngleOmegaFactor: number;
  slopeToOmega: number[];
  angleLossStabilizationAfterRicochet: number;
  penetrationReduction: PenetrationReduction;
}

export interface PenetrationReduction {
  pnt: Array<number[]>;
}

export interface TracePattern {
  caliber: number;
  circleCount: number;
  pointCount: number;
}

export interface Visual {
  range_percent_of_ammo: number[];
  traceFreq: number;
  tracer: string;
  trail: string;
}

export interface Shop {
  country_usa: ShopCountry;
  country_germany: ShopCountry;
  country_ussr: ShopCountry;
  country_britain: ShopCountry;
  country_japan: ShopCountry;
  country_china: ShopCountry;
  country_italy: ShopCountry;
  country_france: ShopCountry;
  country_sweden: ShopCountry;
  country_israel: ShopCountry;
}

export interface ShopCountry {
  army: ShopRange;
  helicopters: ShopRange;
  aviation: ShopRange;
  ships?: ShopRange;
  boats?: ShopRange;
}

export interface ShopRange {
  range: Record<string, ShopItem | ShopGroup>[] | Record<string, ShopItem | ShopGroup>;
}

export interface ShopItem {
  rank: number;
  reqAir?: "" | ""[] | string;
  gift?: "msi_notebook";
  showOnlyWhenBought?: true;
  marketplaceItemdefId?: number;
  hideFeature?: "!Marketplace";
  event?: string;
  reqFeature?: "ClanVehicles";
  isClanVehicle?: true;
  showByPlatform?: string;
  hideByPlatform?: string;
}

export type ShopGroup = {
  image: string;
  reqAir?: "" | string;
} & {
  [key: string]: ShopItem;
};

// aces/config/gui
export interface GUI {
  bundles: Bundles;
}

export interface Bundles {
  guid: { [key: string]: string };
}

// char/modifications

export interface Mods {
  modifications: { [key: string]: Modification };
  templates: Templates;
}

export interface Modification {
  image?: string;
  valueMul?: number;
  costGold?: boolean;
  reqModification?: string;
  group?: string;
  effects?: Effects;
  modClass?: GameModClass;
  tier?: number;
  caliber?: number;
  deactivationIsAllowed?: boolean;
  invertEnableLogic?: boolean;
  modOverdriveType?: ModEType;
  modUpgradeType?: ModEType;
  isTurretBelt?: boolean;
  requiresModelReload?: boolean;
  autoMod?: boolean;
  premAir?: boolean;
  commonAir?: boolean;
  minRank?: number;
  maxRank?: number;
  specialPrice?: boolean;
  prevModification?: string;
  dontDecreaseAirRCost?: boolean;
  overdriveEffect?: { [key: string]: number };
  upgradeEffect?: { [key: string]: number };
  isReserve?: boolean;
  turn_it_off?: boolean;
  maxCount?: number;
  isHidden?: boolean;
}

export interface Effects {
  bulletMod?: string;
  weaponMod?: string;
  mulCdmin?: number;
  mulOswEffNumber?: number;
  mulCdminFusel?: number;
  mulCdminTail?: number;
  gForceTolerationMult?: number;
  aileronBooster?: number;
  rudderBooster?: number;
  elevatorBooster?: number;
  mulHorsePowers?: number;
  mulCompressorMaxP?: number;
  thrustMult?: number;
  torqueMult?: number;
  radiatorEffMul?: number;
  extinguisherNum?: number;
  afterburnerMult?: number;
  wepOverspeedMult?: number;
  throttleMult?: number;
  damageReceivedMult?: number;
  mulMass?: number;
  cutProbabilityMult?: number;
  additiveBulletMod?: string;
  allowSupportPlane?: boolean;
  mulMaxDeltaAngle?: number;
  mulMaxDeltaAngleVertical?: number;
  mulFrontalStaticFriction?: number;
  mulFrontalSlidingFriction?: number;
  mulSideRotMinSpd?: number;
  mulSideRotMaxSpd?: number;
  mulSideRotMinFric?: number;
  mulSideRotMaxFric?: number;
  tracks?: EffectsTracks;
  hideNodes?: HideNodes;
  damagePartsOverride?: DamagePartsOverride;
  mulSuspensionDampeningMoment?: number;
  mulSuspensionMinLimit?: number;
  mulSuspensionMaxLimit?: number;
  mulSuspensionResting?: number;
  rcostMul?: number;
  mulMaxBrakeForce?: number;
  mulTransmissionEfficiency?: number;
  fakeParam?: number;
  smokeScreenCount?: number;
  smokeScreenTime?: number;
  smokeScreenCooldown?: number;
  gunnerSpeedDeflection?: number;
  mulSpeedYaw?: number;
  mulSpeedPitch?: number;
  rcostAddParam?: number;
  supportUnitClass?: string;
  supportUnitTag?: string;
  extinguisherAutomatic?: boolean;
  extinguisherActivationCount?: number;
  extinguisherMinTime?: number;
  extinguisherMaxTime?: number;
  extinguisherCrewBusyTime?: number;
  extinguisherCooldown?: number;
  repairAvailable?: boolean;
  healingCooldown?: number;
  medicalkitCount?: number;
  rangefinderMounted?: boolean;
  distanceError?: number[];
  distanceThresholdMin?: number[];
  distanceThresholdMax?: number[];
  distanceErrorRealistic?: number[];
  distanceThresholdMinRealistic?: number[];
  distanceThresholdMaxRealistic?: number[];
  timeMeasurementRange?: number[];
  sensors?: ModSensors;
  isLaser?: boolean;
  enableNightVision?: boolean;
  diggingAvailable?: boolean;
  diggingActivateTime?: number;
  diggingLevel?: number;
  digMaxSpeed?: number;
  digMaxRevSpeed?: number;
  killStreakExtraJoin?: boolean;
  scoutingScoreMultiplier?: number;
  improvedOpticsMult?: number;
  mulMaxSpeed?: number;
  mulMaxReverseSpeed?: number;
  mulRudderArea?: number;
  mulRudderDeflection?: number;
  mulTimeToMaxSpeed?: number;
  mulTimeToMaxReverseSpeed?: number;
  speedBoosterMaxCount?: number;
  speedBoosterRise?: number;
  speedBoosterTimeOut?: number;
  waterMassVelMult?: number;
  aaSpeedYawK?: number;
  aaSpeedPitchK?: number;
  auxSpeedYawK?: number;
  auxSpeedPitchK?: number;
  mainSpeedYawK?: number;
  mainSpeedPitchK?: number;
  shipDistancePrecisionErrorMult?: number;
  mulCdminMainRotor?: number;
  mulOswEffNumberMainRotor?: number;
  addThrustVecAzimuth?: number;
  addThrustVecElevation?: number;
  enginesInfraRedBrightnessMult?: number;
}

export interface DamagePartsOverride {
  tracks: DamagePartsOverrideTracks;
}

export interface DamagePartsOverrideTracks {
  hpMult: number;
}

export interface HideNodes {
  node: string[];
}

export interface ModSensors {
  sensor: SensorElement[] | SensorElement;
}

export interface SensorElement {
  blk: string;
}

export interface EffectsTracks {
  width: number;
  trackMesh?: string;
  nonSymmetricMesh?: boolean;
}

export type GameModClass =
  | "weapon"
  | "premium"
  | "lth"
  | "armor"
  | "firepower"
  | "mobility"
  | "protection"
  | "expendable"
  | "seakeeping"
  | "unsinkability";

export type ModEType = "new_gun";

export interface Templates {
  new_gun: NewGun;
}

export interface NewGun {
  copyWeaponMod: boolean;
  overdriveEffect: OverdriveEffect;
  upgradeEffect: OverdriveEffect;
  overdriveEffect_inverted: OverdriveEffect;
  upgradeEffect_inverted: OverdriveEffect;
}

export interface OverdriveEffect {
  mulMaxDeltaAngleOverdrive: number;
  overheatTimingMulOverdrive: number;
}

// char/rank

export interface Rank {
  xpMultiplier: number;
  goldPlaneExpMul: number;
  expForVictoryVersus: number;
  expForPlayingVersus: number;
  expForVictoryVersusPerSec: number;
  expForPlayingVersusPerSec: number;
  expBaseVersusPerSec: number;
  modsTierExpToAircraftCoef: number;
  prevAirExpMulMode0: number;
  prevAirExpMulMode1: number;
  prevAirExpMulMode2: number;
  prevAirExpMulMode3: number;
  prevAirExpMulMode4: number;
  prevAirExpMulMode5: number;
  prevAirExpMulMode6: number;
  prevAirExpMulMode7: number;
  prevAirExpMulMode8: number;
  expMulWithTierDiff0: number;
  expMulWithTierDiff1: number;
  expMulWithTierDiff2: number;
  expMulWithTierDiff3: number;
  expMulWithTierDiff4: number;
  expMulWithTierDiff5: number;
  expMulWithTierDiff6: number;
  expMulWithTierDiff7: number;
  expMulWithTierDiffMinus0: number;
  expMulWithTierDiffMinus1: number;
  expMulWithTierDiffMinus2: number;
  expMulWithTierDiffMinus3: number;
  expMulWithTierDiffMinus4: number;
  expMulWithTierDiffMinus5: number;
  expMulWithTierDiffMinus6: number;
  expMulWithTierDiffMinus7: number;
  crew_exp_mul: number;
  crew_exp_mul_arcade: number;
  crew_exp_mul_historical: number;
  crew_exp_mul_simulation: number;
  maxXPLimit: number;
  expForHitTimeout: number;
  expForIneffectiveTankHitTimeout: number;
  expForShipHitTimeout: number;
  ineffectiveHitMinCount: number;
  ineffectiveHitMinPart: number;
  expForAssistTime: number;
  expForAssistDmg: number;
  expForAssistTimeShip: number;
  expForAssistDmgShip: number;
  denominateFreeExp: number;
  units: { [key: string]: number };
  crew_slots: { [key: string]: CrewSlot };
  country: Country;
  needBuyToOpenNextInEra: NeedBuyToOpenNextInEra;
  exp_for_playerRank: { [key: string]: number };
  prestige_by_rank: PrestigeByRank;
  ww_settings: WwSettings;
  crew_parameters: CrewParameters;
}

export interface Country {
  c: string[];
}

export interface CrewParameters {
  mechanicHangarRepairSpeedLow: number;
  mechanicHangarRepairSpeedHigh: number;
  mechanicAirieldRepairDurationLow: number;
  mechanicAirieldRepairDurationHigh: number;
  weaponsmithGunReloadSpeedLow: number;
  weaponsmithGunReloadSpeedHigh: number;
  weaponsmithCannonReloadSpeedLow: number;
  weaponsmithCannonReloadSpeedHigh: number;
  weaponsmithBombsReloadSpeedLow: number;
  weaponsmithBombsReloadSpeedHigh: number;
  weaponsmithRocketsReloadSpeedLow: number;
  weaponsmithRocketsReloadSpeedHigh: number;
  weaponsmithTorpedoesReloadSpeedLow: number;
  weaponsmithTorpedoesReloadSpeedHigh: number;
  weaponsmithGunnersReloadSpeedLow: number;
  weaponsmithGunnersReloadSpeedHigh: number;
  gForceAdaptationKLow: number;
  gForceAdaptationKHigh: number;
  gForceArcadeMul: number;
  gForcePercievedViscosity: number;
  gForceMinusPercievedViscosity: number;
  gForceReleasePercievedViscosity: number;
  gForceActingViscosity: number;
  gForceMinusActingViscosity: number;
  gForceReleaseActingViscosity: number;
  gForceAdoptedViscosity: number;
  gForceAdoptedMin: number;
  gForceAdoptedMinMaxAdaptation: number;
  gForceAdoptedMax: number;
  gForceAdoptedMaxMaxAdaptation: number;
  gForceUnadoptedViscosity: number;
  gForceBlackoutStart: number;
  gForceBlackoutStartMaxAdaptation: number;
  gForceBlackoutEnd: number;
  gForceBlackoutEndMaxAdaptation: number;
  gForceRedoutStart: number;
  gForceRedoutStartMaxAdaptation: number;
  gForceRedoutEnd: number;
  gForceRedoutEndMaxAdaptation: number;
  gForceRedoutPosteffectViscosity: number;
  gForceBlackoutPosteffectViscosity: number;
  gForceSwitchPosteffectViscosity: number;
  gunnerAccuracyLow: number;
  gunnerAccuracyHigh: number;
  gunnerAccuracyLowNoStamina: number;
  gunnerAccuracyHighNoStamina: number;
  gunnerDensityLow: number;
  gunnerDensityHigh: number;
  gunnerDensityLowNoStamina: number;
  gunnerDensityHighNoStamina: number;
  pilotDamageMultiplierLow: number;
  pilotDamageMultiplierHigh: number;
  pilotDeathChanceMultiplierLow: number;
  pilotDeathChanceMultiplierHigh: number;
  gunnerDamageMultiplierLow: number;
  gunnerDamageMultiplierHigh: number;
  gunnerDeathChanceMultiplierLow: number;
  gunnerDeathChanceMultiplierHigh: number;
  pilotVisionSpottingDistanceLow: number;
  pilotVisionSpottingDistanceHigh: number;
  pilotVisionInstantSpottingDistanceLow: number;
  pilotVisionInstantSpottingDistanceHigh: number;
  pilotHearingSpottingDistanceLow: number;
  pilotHearingSpottingDistanceHigh: number;
  pilotHearingInstantSpottingDistanceLow: number;
  pilotHearingInstantSpottingDistanceHigh: number;
  gunnerVisionSpottingDistanceLow: number;
  gunnerVisionSpottingDistanceHigh: number;
  gunnerVisionInstantSpottingDistanceLow: number;
  gunnerVisionInstantSpottingDistanceHigh: number;
  gunnerHearingSpottingDistanceLow: number;
  gunnerHearingSpottingDistanceHigh: number;
  gunnerHearingInstantSpottingDistanceLow: number;
  gunnerHearingInstantSpottingDistanceHigh: number;
  staminaRestorationSpeedLow: number;
  staminaRestorationSpeedHigh: number;
  staminaPositiveGMin: number;
  staminaPositiveUsageSpeed: number;
  staminaNegativeGMin: number;
  staminaNegativeUsageSpeed: number;
  staminaAdoptableNegativeGPart: number;
  staminaAdoptablePositiveGPart: number;
  pilotMouseAimSmoothnessKLow: number;
  pilotMouseAimSmoothnessKHigh: number;
  pilotMouseAimNoiseKLow: number;
  pilotMouseAimNoiseKHigh: number;
  mechanic: Mechanic;
  weaponsmith: Weaponsmith;
  gForce: GForce;
  gunner: Gunner;
  pilot: Pilot;
  stamina: StaminaClass;
  tank_crew: TankCrew;
  ship_crew: ShipCrew;
}

export interface GForce {
  adaptationK: number[];
  arcadeMul: number;
  percievedViscosity: Viscosity;
  actingViscosity: Viscosity;
  adopted: Adopted;
  unadopted: Unadopted;
  blackout: Out;
  redout: Out;
  posteffectViscosity: PosteffectViscosity;
}

export interface Viscosity {
  positive: number;
  negative: number;
  release: number;
}

export interface Adopted {
  min: number[];
  max: number[];
  viscosity: number;
}

export interface Out {
  start: number[];
  end: number[];
}

export interface PosteffectViscosity {
  blackout: number;
  redout: number;
  switch: number;
}

export interface Unadopted {
  viscosity: number;
}

export interface Gunner {
  shootingRealistic: Shooting;
  shooting: Shooting;
  takingDamage: TakingDamage;
  detection: Detection;
}

export interface Detection {
  helicopter: Helicopter;
  vision: Vision;
  hearing: Hearing;
}

export interface Hearing {
  spottingDistance: number[];
  instantSpottingDistance: number[];
}

export interface Helicopter {
  vision: Vision;
  hearing: Hearing;
}

export interface Vision {
  spottingDistance: number[];
  instantSpottingDistance: number[];
  rocketSpottingDistance: number[];
  rocketSpottingTime?: number[];
}

export interface Shooting {
  fullStamina: Stamina;
  noStamina: Stamina;
  rotationSpeed: BulletDeviation;
  bulletDeviation: BulletDeviation;
  burstMinDurationSeconds: BulletDeviation;
  burstMaxDurationSeconds: BulletDeviation;
  trackingMinDuration: BulletDeviation;
  trackingMaxDuration: BulletDeviation;
  sleepMinDuration: BulletDeviation;
  sleepMaxDuration: BulletDeviation;
  openFireDistance: BulletDeviation;
  startTrackingDistance: BulletDeviation;
  switchTargetMinDistance: BulletDeviation;
  openFireWhileTrackingProbability: BulletDeviation;
  sleepAfterBurstProbability: BulletDeviation;
  switchTargetWhileTrackingProbability: BulletDeviation;
  predictionDisplacementMultiplier: BulletDeviation;
}

export interface BulletDeviation {
  accuracyMultiplier: number[];
  densityMultiplier: number[];
  redBlackoutMultiplier: number[];
  positiveOverload: NegativeOverload;
  negativeOverload: NegativeOverload;
  tangage: NegativeOverload;
  roll: NegativeOverload;
}

export interface NegativeOverload {
  value: number[];
  multiplier: number[];
}

export interface Stamina {
  accuracy: number[];
  density: number[];
}

export interface TakingDamage {
  damageMultiplier: number[];
  deathChanceMultiplier: number[];
}

export interface Mechanic {
  hangarRepairSpeed: number[];
  airfieldRepairDuration: number[];
  airfieldReloadDuration: number[];
}

export interface Pilot {
  takingDamage: TakingDamage;
  detection: Detection;
  mouseAim: MouseAim;
}

export interface MouseAim {
  smoothnessK: number[];
  noiseK: number[];
}

export interface ShipCrew {
  crewShipToAircraftViewCamSpottingDistance: number;
  crewShipHearingDistance: number;
  crewShipHearingSpottingDistance: number;
  crewShipVisionDistance: number;
  crewShipVisionSpottingDistance: number;
  crewShipToTorpedoViewCamSpottingDistance: number;
  crewShipToMineViewCamSpottingDistance: number;
  visionSpottingDistanceMultiplier: number[];
  ship_commander: ShipCommander;
  ship_engine_room: ShipEngineRoom;
  ship_artillery: ShipArtillery;
  ship_damage_control: ShipDamageControl;
  ship_dock_service: ShipDockService;
}

export interface ShipArtillery {
  mainCaliberReloadMult: number[];
  auxCaliberReloadMult: number[];
  antiairCaliberReloadMult: number[];
  antiairGunnerMaxAngle: number[];
  auxGunnerMaxAngle: number[];
  distFuseAccuracy: number[];
}

export interface ShipCommander {
  interchangeAbilityMult: number[];
  leadership: number[];
  radioDistanceMult: number[];
}

export interface ShipDamageControl {
  unwatering: number[];
  extinguisherTimeMult: number[];
  fireDamageMult: number[];
  repairTimeMult: number[];
  surviveEffortMult: number[];
}

export interface ShipDockService {
  torpedoGunSpreadMult: number[];
  rocketGunSpreadMult: number[];
  machineGunCoolDownMult: number[];
}

export interface ShipEngineRoom {
  operationTime: number[];
  floodCriticalWork: number[];
  antiFireSkill: number[];
}

export interface StaminaClass {
  restorationSpeed: number[];
  staminaAttenuationK: number[];
  staminaUsageThreshold: number;
  positiveOverload: TiveOverload;
  negativeOverload: TiveOverload;
}

export interface TiveOverload {
  usageSpeed: number[];
  adoptableGMultiplier: number[];
}

export interface TankCrew {
  crewTankHearingDistance: number;
  crewTankHearingSpottingDistance: number;
  crewTankVisionDistance: number;
  crewTankVisionSpottingDistance: number;
  crewTankViewCamVisionDistance: number;
  crewTankViewCamVisionSpottingDistance: number;
  crewTankToAircraftViewCamSpottingDistance: number;
  crewTankVisionAngle: number;
  crewTankVisionSpottingAngle: number;
  driver: Driver;
  tank_gunner: { [key: string]: number[] };
  commander: Commander;
  loader: Loader;
  radio_gunner: RadioGunner;
}

export interface Commander {
  visionSpottingDistanceMultiplier: number[];
  fieldRepairSpeedMultiplier: number[];
  damageMultiplier: number[];
  changeTimeMultiplier: number[];
  leadership: number[];
  machineGunError: number[];
}

export interface Driver {
  visionSpottingDistanceMultiplier: number[];
  fieldRepairSpeedMultiplier: number[];
  damageMultiplier: number[];
  changeTimeMultiplier: number[];
  brakesTau: number[];
  gearChangeTime: number[];
  maxForwardSpeed: number[];
  maxBackSpeed: number[];
  driverSpeedThreshold: number;
}

export interface Loader {
  visionSpottingDistanceMultiplier: number[];
  fieldRepairSpeedMultiplier: number[];
  damageMultiplier: number[];
  changeTimeMultiplier: number[];
  loadingTimeMult: number[];
}

export interface RadioGunner {
  visionSpottingDistanceMultiplier: number[];
  fieldRepairSpeedMultiplier: number[];
  damageMultiplier: number[];
  changeTimeMultiplier: number[];
  artilleryDispersionMult: number[];
  artilleryAdjustmentDispersionMult: number[];
  artilleryTimeToFirstShotMult: number[];
  artilleryTimeBetweenShotsMult: number[];
  artilleryTimeBetweenAdjustmentsShots: number[];
  radioDistanceMult: number[];
}

export interface Weaponsmith {
  reloadSpeed: ReloadSpeed;
  weaponCare: WeaponCare;
}

export interface ReloadSpeed {
  gun: number[];
  cannon: number[];
  schraegeMusik: number[];
  bombs: number[];
  rockets: number[];
  torpedoes: number[];
  gunners: number[];
}

export interface WeaponCare {
  bombScatterMultiplier: number[];
  torpedoScatterMultiplier: number[];
  rocketScatterMultiplier: number[];
  jamProbabilityMultiplier: number[];
}

export interface CrewSlot {
  cost: number;
  costGold: number;
}

export interface NeedBuyToOpenNextInEra {
  country_ussr: { [key: string]: number };
  country_usa: { [key: string]: number };
  country_germany: { [key: string]: number };
  country_britain: { [key: string]: number };
  country_japan: { [key: string]: number };
  country_italy: { [key: string]: number };
  country_france: { [key: string]: number };
  country_china: { [key: string]: number };
  country_sweden: { [key: string]: number };
  country_israel: { [key: string]: number };
}

export interface PrestigeByRank {
  prestige0: number;
  prestige1: number;
  prestige2: number;
  prestige3: number;
  prestige4: number;
  prestige5: number;
  prestige6: number;
  prestige7: number;
  prestige8: number;
}

export interface WwSettings {
  checkUnitAvailability: string;
  minCraftRank: number;
}

//custom

export interface LangData {
  ID: string;
  English: string;
}

export interface savedparse {
  title: string;
  pageid: number;
  text: {
    "*": string;
  };
}

export interface modernparse {
  title: string;
  pageid: number;
}

export interface namevehicles {
  ground: namevehicle[];
  aviation: namevehicle[];
  helicopter: namevehicle[];
  ships: namevehicle[];
  boats: namevehicle[];
}

export interface namevehicle {
  intname: string;
  wikiname?: string;
  marketplace?: string;
  store?: string;
}

// Final

export type VehicleProps = GroundProps | AircraftProps | HelicopterProps | ShipProps | BoatProps;

export const premTypeSchema = z.enum(["false", "event", "marketplace", "store", "gold", "squad"]);

export const normalAircraftTypeSchema = z.enum(["type_fighter", "type_bomber", "type_assault"]);
export const normalGroundTypeSchema = z.enum([
  "type_light_tank",
  "type_medium_tank",
  "type_heavy_tank",
  "type_tank_destroyer",
  "type_spaa",
]);
export const normalHelcopterTypeSchema = z.enum([
  "type_attack_helicopter",
  "type_utility_helicopter",
]);

export const vehiclRankSchema = z.number().max(8).min(1);
export type VehicleRank = z.infer<typeof vehiclRankSchema>;

export const finalPropsSchema = z.object({
  intname: z.string(),
  wikiname: z.string().optional(),
  displayname: z.string().optional(),
  country: z.string(),
  operator_country: z.string().optional(),
  rank: vehiclRankSchema,
  crew: z.number(),
  sl_price: z.number(),
  reqRP: z.number().optional(),
  br: z.array(z.string()).length(3),
  realbr: z.array(z.number()).length(3),
  base_repair: z.array(z.number()).length(3),
  rp_multiplyer: z.number(),
  sl_multiplyer: z.array(z.number()).length(3),
  prem_type: premTypeSchema,
  event: z.string().optional(),
  cost_gold: z.number().optional(),
  hidden: z.boolean().optional(),
  marketplace: z.string().optional(),
  store: z.string().optional(),
});

export type FinalProps = z.infer<typeof finalPropsSchema>;

export const ballisticComputerSchema = z.object({
  ccip_guns: z.literal(true).optional(),
  ccip_rockets: z.literal(true).optional(),
  ccip_bombs: z.literal(true).optional(),
  ccrp_bombs: z.literal(true).optional(),
});
export type BallisticComputer = z.infer<typeof ballisticComputerSchema>;

export const finalWeaponArraySchema = z.object({
  type: z
    .union([
      z.literal("aam"),
      z.literal("agm"),
      z.literal("bomb"),
      z.literal("guided_bomb"),
      z.literal("torpedo"),
      z.literal("rocket"),
      z.literal("gun"),
      z.literal("countermeasures"),
      z.literal("fuel_tank"),
      z.literal("optics"),
      z.literal("targeting_pod"),
      z.literal("booster"),
    ])
    .nullable(),
  displayname: z.string().optional(),
  bullets: z.number().optional(),
});
export type FinalWeaponArray = z.infer<typeof finalWeaponArraySchema>;

export const weaponSchema = z.object({
  type: z
    .union([
      z.literal("aam"),
      z.literal("agm"),
      z.literal("bomb"),
      z.literal("guided_bomb"),
      z.literal("torpedo"),
      z.literal("rocket"),
      z.literal("gun"),
      z.literal("countermeasures"),
      z.literal("fuel_tank"),
      z.literal("optics"),
      z.literal("targeting_pod"),
      z.literal("booster"),
    ])
    .nullable(),
  bullets: z.number().optional(),
  intname: z.string(),
  displayname: z.string().optional(),
  reqModification: z.union([z.string(), z.array(z.string())]).optional(),
});

export const finalWeaponSchema = weaponSchema.extend({
  iconType: z.string(),
});
export type FinalWeapon = z.infer<typeof finalWeaponSchema>;

export const weaponsSchema = z.object({
  intname: z.string(),
  reqModification: z.union([z.string(), z.array(z.string())]).optional(),
  weapons: z.array(finalWeaponArraySchema),
});

export const finalWeaponsSchema = weaponsSchema.extend({
  iconType: z.string(),
});
export type FinalWeapons = z.infer<typeof finalWeaponsSchema>;

export const finalWeaponSlot = z.union([
  z.object({
    hidden: z.boolean(),
    slot: z.array(
      z.union([
        weaponsSchema,
        weaponSchema,
        z.object({
          name: z.string(),
        }),
      ]),
    ),
  }),
  z.object({
    slot: z.array(
      z.union([
        finalWeaponsSchema,
        finalWeaponSchema,
        z.object({
          name: z.string(),
        }),
      ]),
    ),
  }),
]);
export type FinalWeaponSlot = z.infer<typeof finalWeaponSlot>;

export const secondaryWeaponPresetSchema = z.object({
  maxload: z.number(),
  maxloadLeft: z.number(),
  maxloadRight: z.number(),
  maxDisbalance: z.number(),
  weaponSlots: z.array(finalWeaponSlot),
});
export type SecondaryWeaponPreset = z.infer<typeof secondaryWeaponPresetSchema>;

export const aircraftTypeSchema = z.object({
  normal_type: z.enum(["type_fighter", "type_bomber", "type_assault", "type_strike_ucav"]),
  extended_type: z
    .array(
      z.enum([
        "type_jet_fighter",
        "type_jet_bomber",
        "type_longrange_bomber",
        "type_frontline_bomber",
        "type_hydroplane",
        "type_naval_aircraft",
        "type_torpedo_bomber",
        "type_dive_bomber",
        "type_interceptor",
        "type_aa_fighter",
        "type_light_bomber",
      ]),
    )
    .optional(),
});

export const aircraftPropsSchema = finalPropsSchema
  .extend({
    crew: z.number().optional(),
    type: z.literal("aircraft"),
    ballistic_computer: ballisticComputerSchema.optional(),
    secondary_weapon_preset: secondaryWeaponPresetSchema.optional(),
  })
  .merge(aircraftTypeSchema);
export type AircraftProps = z.infer<typeof aircraftPropsSchema>;

export const opticIr = z.object({
  resolution: z.tuple([
    z.union([z.literal(800), z.literal(1200), z.literal(1600)]),
    z.union([z.literal(600), z.literal(800), z.literal(1200)]),
  ]),
  lightMult: z.union([z.literal(5), z.literal(7), z.literal(8), z.literal(9)]),
  ghosting: z.union([z.literal(0.7), z.literal(0.75), z.literal(0.6)]),
  noiseFactor: z.literal(0.2),
});

export const sightSchema = z.object({
  ir: opticIr.optional(),
  thermal: z
    .object({
      resolution: z.tuple([
        z.union([z.literal(500), z.literal(800), z.literal(1200)]),
        z.union([z.literal(300), z.literal(600), z.literal(800)]),
      ]),
      noiseFactor: z.union([z.literal(0.05), z.literal(0.04)]),
    })
    .optional(),
});

export const gunnerSightSchema = sightSchema.extend({
  zoomInFov: z.number(),
  zoomOutFov: z.number(),
});

export const sightsSchema = z.object({
  driver: sightSchema.optional(),
  gunner: gunnerSightSchema,
  commander: gunnerSightSchema.optional(),
});
export type Sights = z.infer<typeof sightsSchema>;

export const shellSchema = z.object({
  modname: z.string(),
  intname: z.string().optional(),
  type: z.string(),
  name: z.string().optional(),
  maxamount: z.number().optional(),
  modmaxamount: z.number().optional(),
});
export type Shell = z.infer<typeof shellSchema>;

export const beltSchema = z.object({
  intname: z.string(),
  type: z.string(),
  name: z.string().optional(),
});
export type Belt = z.infer<typeof beltSchema>;

export const hullAimingSchema = z.object({
  horizontal: z.boolean().optional(),
  vertical: z.boolean().optional(),
  maxRoll: z.number(),
});

export const stabilizerSchema = z.object({
  shoulderStop: z.boolean().optional(),
  horizontal: z.boolean().optional(),
  vertical: z.boolean().optional(),
  horizontalSpeed: z.number().optional(),
  verticalSpeed: z.number().optional(),
});
export type Stabilizer = z.infer<typeof stabilizerSchema>;

export const nightVisionSchema = z.object({
  commanderViewThermal: z
    .object({
      resolution: z.tuple([
        z.union([z.literal(500), z.literal(800), z.literal(1200)]),
        z.union([z.literal(300), z.literal(600), z.literal(800)]),
      ]),
      noiseFactor: z.union([z.literal(0.05), z.literal(0.04)]),
    })
    .optional(),
  gunnerThermal: z
    .object({
      resolution: z.tuple([
        z.union([z.literal(500), z.literal(800), z.literal(1200)]),
        z.union([z.literal(300), z.literal(600), z.literal(800)]),
      ]),
      noiseFactor: z.union([z.literal(0.05), z.literal(0.04)]),
    })
    .optional(),
  driverThermal: z
    .object({
      resolution: z.tuple([
        z.union([z.literal(500), z.literal(800), z.literal(1200)]),
        z.union([z.literal(300), z.literal(600), z.literal(800)]),
      ]),
      noiseFactor: z.union([z.literal(0.05), z.literal(0.04)]),
    })
    .optional(),
  commanderViewIr: z
    .object({
      resolution: z.tuple([
        z.union([z.literal(800), z.literal(1600)]),
        z.union([z.literal(600), z.literal(1200)]),
      ]),
      lightMult: z.union([z.literal(5), z.literal(8), z.literal(9)]),
      ghosting: z.union([z.literal(0.7), z.literal(0.75), z.literal(0.6)]),
      noiseFactor: z.literal(0.2),
    })
    .optional(),
  driverIr: z
    .object({
      resolution: z.tuple([
        z.union([z.literal(800), z.literal(1600)]),
        z.union([z.literal(600), z.literal(1200)]),
      ]),
      lightMult: z.union([z.literal(5), z.literal(8), z.literal(9)]),
      ghosting: z.union([z.literal(0.7), z.literal(0.75), z.literal(0.6)]),
      noiseFactor: z.literal(0.2),
    })
    .optional(),
  gunnerIr: z
    .object({
      resolution: z.tuple([
        z.union([z.literal(800), z.literal(1600)]),
        z.union([z.literal(600), z.literal(1200)]),
      ]),
      lightMult: z.union([z.literal(5), z.literal(8), z.literal(9)]),
      ghosting: z.union([z.literal(0.7), z.literal(0.75), z.literal(0.6)]),
      noiseFactor: z.literal(0.2),
    })
    .optional(),
});
export type NightVision = z.infer<typeof nightVisionSchema>;

export const shellBeltSchema = z.object({
  modname: z.string(),
  name: z.string(),
  maxamount: z.number().optional(),
  modmaxamount: z.number().optional(),
  shells: z.array(beltSchema),
});
export type ShellBelt = z.infer<typeof shellBeltSchema>;

export const genericGunSchema = z.object({
  intname: z.string(),
  displayname: z.string(),
  ammo: z.number(),
  shells: z.array(shellSchema).optional(),
  belts: z.array(shellBeltSchema).optional(),
  shotFreq: z.number(),
  caliber: z.number(),
  horizonalSpeed: z.union([z.number(), z.literal("primary")]),
  verticalSpeed: z.union([z.number(), z.literal("primary")]),
  horizonalLimit: z.union([z.array(z.number()), z.literal("primary")]),
  verticalLimit: z.union([z.array(z.number()), z.literal("primary")]),
});
export type GenericGun = z.infer<typeof genericGunSchema>;

export const tankCannonSchema = genericGunSchema.extend({
  secondary: z.boolean().optional(),
  autoloader: z.boolean().optional(),
  stabilizer: stabilizerSchema.optional(),
  hullAiming: hullAimingSchema.optional(),
});
export type TankCannon = z.infer<typeof tankCannonSchema>;

export const tankWeaponsSchema = z.object({
  cannon: z.array(z.union([tankCannonSchema, z.undefined()])).optional(),
  machineGun: z.array(z.union([genericGunSchema, z.undefined()])).optional(),
});
export type TankWeapons = z.infer<typeof tankWeaponsSchema>;

export const groundTypeSchema = z.object({
  normal_type: z.enum([
    "type_light_tank",
    "type_medium_tank",
    "type_heavy_tank",
    "type_tank_destroyer",
    "type_spaa",
  ]),
  extended_type: z.array(z.enum(["type_missile_tank"])).optional(),
});

export const groundPropsSchema = finalPropsSchema
  .extend({
    type: z.literal("ground"),
    mass: z.number().optional(),
    horsepower: z.number().optional(),
    gears_forward: z.number().optional(),
    gears_backward: z.number().optional(),
    hydro_suspension: z.boolean().optional(),
    can_float: z.boolean().optional(),
    has_synchro: z.boolean().optional(),
    has_neutral: z.boolean().optional(),
    has_dozer: z.boolean().optional(),
    has_ess: z.boolean().optional(),
    has_smoke: z.boolean().optional(),
    has_lws: z.boolean().optional(),
    has_era: z.boolean().optional(),
    has_composite: z.boolean().optional(),
    has_laser_range: z.boolean().optional(),
    has_range: z.boolean().optional(),
    optics: sightsSchema,
    weapons: tankWeaponsSchema.optional(),
  })
  .merge(groundTypeSchema);
export type GroundProps = z.infer<typeof groundPropsSchema>;

export const heliSightSchema = z.object({
  ir: z
    .object({
      resolution: z.array(z.number()),
      lightMult: z.number(),
      ghosting: z.number(),
      noiseFactor: z.number(),
    })
    .optional(),
});

export const heliGunnerSightSchema = heliSightSchema.extend({
  zoomInFov: z.number(),
  zoomOutFov: z.number(),
  thermal: z
    .object({
      resolution: z.tuple([z.literal(1024), z.literal(768)]),
      noiseFactor: z.union([z.literal(0.5), z.literal(0.05)]),
    })
    .optional(),
});

export const helicopterOpticsSchema = z.object({
  pilot: heliSightSchema.optional(),
  gunner: heliSightSchema.optional(),
  sight: heliGunnerSightSchema.optional(),
});
export type HelicopterOptics = z.infer<typeof helicopterOpticsSchema>;

export const helicopterTypeSchema = z.object({
  normal_type: z.enum(["type_attack_helicopter", "type_utility_helicopter"]),
  extended_type: z.array(z.enum(["type_utility_helicopter"])).optional(),
});

export const helicopterPropsSchema = finalPropsSchema
  .extend({
    type: z.literal("helicopter"),
    ballistic_computer: ballisticComputerSchema.optional(),
    secondary_weapon_preset: secondaryWeaponPresetSchema.optional(),
    has_maw: z.boolean().optional(),
    has_lws: z.boolean().optional(),
    has_rwr: z.boolean().optional(),
    has_ircm: z.boolean().optional(),
    has_hirss: z.boolean().optional(),
    optics: helicopterOpticsSchema.optional(),
  })
  .merge(helicopterTypeSchema);
export type HelicopterProps = z.infer<typeof helicopterPropsSchema>;

export const shipTypeSchema = z.object({
  normal_type: z.enum([
    "type_battlecruiser",
    "type_battleship",
    "type_frigate",
    "type_light_cruiser",
    "type_heavy_cruiser",
    "type_destroyer",
  ]),
});

export const shipPropsSchema = finalPropsSchema
  .extend({
    type: z.literal("ship"),
  })
  .merge(shipTypeSchema);
export type ShipProps = z.infer<typeof shipPropsSchema>;

export const boatTypeSchema = z.object({
  normal_type: z.enum(["type_barge", "type_boat", "type_frigate"]),
  extended_type: z
    .array(
      z.enum([
        "type_heavy_boat",
        "type_armored_boat",
        "type_torpedo_boat",
        "type_gun_boat",
        "type_naval_ferry_barge",
        "type_naval_aa_ferry",
        "type_torpedo_gun_boat",
        "type_minelayer",
        "type_submarine_chaser",
        "type_frigate",
      ]),
    )
    .optional(),
});

export const boatPropsSchema = finalPropsSchema
  .extend({
    type: z.literal("boat"),
  })
  .merge(boatTypeSchema);
export type BoatProps = z.infer<typeof boatPropsSchema>;

export const vehicleTypesSchema = z.union([
  aircraftTypeSchema,
  groundTypeSchema,
  helicopterTypeSchema,
  shipTypeSchema,
  boatTypeSchema,
]);

export const finalSchema = z.object({
  version: z.string(),
  ground: z.array(groundPropsSchema),
  aircraft: z.array(aircraftPropsSchema),
  helicopter: z.array(helicopterPropsSchema),
  ship: z.array(shipPropsSchema),
  boat: z.array(boatPropsSchema),
});
export type Final = z.infer<typeof finalSchema>;

//Final Shop

export const finalShopItemSchema = z.object({
  name: z.string(),
  rank: vehiclRankSchema,
  reqAir: z.union([z.literal(""), z.string()]).optional(),
  gift: z.boolean().optional(),
  hidden: z.boolean().optional(),
  marketplace: z.number().optional(),
  event: z.string().optional(),
  clanVehicle: z.boolean().optional(),
});
export type FinalShopItem = z.infer<typeof finalShopItemSchema>;

export const finalShopGroupSchema = z.object({
  name: z.string(),
  displayname: z.string(),
  image: z.string(),
  reqAir: z.union([z.literal(""), z.string()]).optional(),
  vehicles: z.array(finalShopItemSchema),
});
export type FinalShopGroup = z.infer<typeof finalShopGroupSchema>;

export const finalShopRangeSchema = z.object({
  col_normal: z.number(),
  min_rank: z.number(),
  max_rank: z.number(),
  needVehicles: z.array(z.number()).max(7),
  range: z.array(z.array(z.union([finalShopItemSchema, finalShopGroupSchema]))),
});
export type FinalShopRange = z.infer<typeof finalShopRangeSchema>;

export const finalRangeSchema = z.union([
  z.array(z.union([finalShopItemSchema, finalShopGroupSchema])),
  z.literal("drawArrow"),
]);
export type FinalRange = z.infer<typeof finalRangeSchema>;

export const finalRangeObjectSchema = z.array(finalRangeSchema);
export type FinalObjectRange = z.infer<typeof finalRangeObjectSchema>;

export const finalFinalShopRangeSchema = finalShopRangeSchema.extend({
  range: z.array(finalRangeObjectSchema),
});
export type FinalFinalShopRange = z.infer<typeof finalFinalShopRangeSchema>;

export const finalShopCountrySchema = z.object({
  army: finalFinalShopRangeSchema,
  helicopters: finalFinalShopRangeSchema,
  aviation: finalFinalShopRangeSchema,
  ship: finalFinalShopRangeSchema.optional(),
  boat: finalFinalShopRangeSchema.optional(),
});

export const finalShopSchema = z.record(finalShopCountrySchema);
export type FinalShop = z.infer<typeof finalShopSchema>;

// Modifications

export interface Modifications {
  ground: (VehicleMods | undefined)[];
  aircraft: (VehicleMods | undefined)[];
  helicopter: (VehicleMods | undefined)[];
  ship: (VehicleMods | undefined)[];
  boat: (VehicleMods | undefined)[];
}

export const modClassName = z.enum([
  "lth",
  "armor",
  "weapon",
  "mobility",
  "protection",
  "firepower",
  "primaryWeapon",
  "secondaryWeapon",
  "premiumMods",
  "expendable",
  "seakeeping",
  "unsinkability",
]);
export type ModClassName = z.infer<typeof modClassName>;

export interface VehicleMods {
  intname: string;
  mods: ModClass;
}

export interface ModClass {
  lth?: BaseMod[][];
  armor?: BaseMod[][];
  weapon?: BaseMod[][];
  mobility?: BaseMod[][];
  protection?: BaseMod[][];
  firepower?: BaseMod[][];
  primaryWeapon?: BaseMod[][];
  secondaryWeapon?: BaseMod[][];
  premiumMods?: BaseMod[][];
  expendable?: BaseMod[][];
  seakeeping?: BaseMod[][];
  unsinkability?: BaseMod[][];
}

export interface BaseMod {
  intname: string;
  displayname?: string;
  reqMod?: string;
  image: string;
}

// Scrape
export const topSpeed = z.number().array().length(2);
export type TopSpeed = z.infer<typeof topSpeed>;

export const visibility = z.number().max(3000);
export type Visibility = z.infer<typeof visibility>;

export interface ScrapeFull {
  ground: Scrape[];
  aircraft: Scrape[];
  helicopter: Scrape[];
}

export interface Scrape {
  intname: string;
  ab_top_speed: TopSpeed;
  rb_top_speed: TopSpeed;
  visibility: Visibility;
}
