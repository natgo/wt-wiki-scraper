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
  country: VehicleCountry;
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

export enum VehicleCountry {
  country_usa = "country_usa",
  country_germany = "country_germany",
  country_ussr = "country_ussr",
  country_britain = "country_britain",
  country_japan = "country_japan",
  country_china = "country_china",
  country_italy = "country_italy",
  country_france = "country_france",
  country_sweden = "country_sweden",
  country_israel = "country_israel",
}

export interface Spare {
  value: number;
  costGold: number;
}

export interface GroundVehicle {
  model: string;
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
  type: string;
  rearmSmokeTimeOnField: number;
  canReloadNonGuns: boolean;
  VehiclePhys: VehiclePhys;
  sound: Sound;
  gunConvergence: GunConvergence;
  cockpit: Cockpit;
  commanderView?: CommanderView;
  DamageParts: DamageParts;
  modifications: Record<string, Mod>;
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

export interface Mod {
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

export interface Cockpit {
  zoomOutFov: number;
  zoomInFov: number;
  sightFov: number;
  sightName: string;
  headPos: number[];
  headPosOnShooting: number[];
  detectionHeight: number;
  bone_turret: string;
}

export interface AirVehicle {
  model: string;
  fmFile: string;
  MetaPartsBlk: string;
  exhaustEffectsBlk: string;
  type: string;
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
  ikPilot: IkPilot;
  attach: Attach;
  Sound: Sound;
  Params: Params;
  cockpit: Cockpit;
  propellers: Propellers;
  commonWeapons: CommonWeapons;
  weapon_presets: WeaponPresets;
  jetwash: Jetwash;
  turbulence: Turbulence;
  fireParams: FireParams;
  wiki: Wiki;
  balanceData: BalanceData;
  user_skin: UserSkin;
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
  releaseDate: Date;
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
  bullet: Bullet[] | Bullet;
} & {
  [key: string]: BulletContainer;
};

export interface BulletContainer {
  bulletsCartridge: number;
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
  bulletName: string;
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
  range: Record<string, ShopItem | ShopGroup>[];
}

export interface ShopItem {
  rank: number;
  reqAir?: "" | string;
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

//custom
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

export interface Final {
  updated: Date;
  ground: GroundProps[];
  aircraft: FinalProps[];
  helicopter: FinalProps[];
}

export interface FinalProps {
  intname: string;
  wikiname: string;
  type: "tank" | "aircraft" | "helicopter";
  normal_type: string;
  extended_type?: string[];
  country: string;
  rank: number;
  crew: number;
  sl_price: number;
  reqRP: number;
  ab_br: string;
  ab_realbr: number;
  rb_br: string;
  rb_realbr: number;
  sb_br: string;
  sb_realbr: number;
  base_ab_repair: number;
  base_rb_repair: number;
  base_sb_repair: number;
  rp_multiplyer: number;
  ab_sl_multiplyer: number;
  rb_sl_multiplyer: number;
  sb_sl_multiplyer: number;
  prem_type: string;
  prem_vehicle?: boolean;
  event?: string;
  cost_gold?: number;
  hidden?: boolean;
  marketplace?: number;
}

export interface GroundProps extends FinalProps {
  mass: number;
  horsepower: number;
  gears_forward: number;
  gears_backward: number;
  hydro_suspension?: true;
  can_float?: true;
  has_synchro?: true;
  has_neutral?: true;
  has_dozer?: true;
  has_ess?: true;
  has_smoke?: true;
  has_lws?: true;
  has_era?: true;
  has_composite?: true;
  has_laser_range?: true;
  has_range?: true;
  weapons?: TankWeapons;
  optics: Sights;
}

export interface Sights {
  driver?: Sight;
  gunner: gunnerSight;
  commander?: gunnerSight;
}

export interface Sight {
  ir?: {
    resolution: [800 | 1600, 600 | 1200];
    lightMult: 5.0 | 8 | 9;
    ghosting: 0.7 | 0.75 | 0.6;
    noiseFactor: 0.2;
  };
  thermal?: {
    resolution: [500 | 800 | 1200, 300 | 600 | 800];
    noiseFactor: 0.05 | 0.04;
  };
}

export interface gunnerSight extends Sight {
  zoomInFov: number; //74
  zoomOutFov: number;
}

export interface TankWeapons {
  cannon?: TankCannon[];
  machineGun?: MG[];
  launcher?: TankCannon;
}

export interface MG {
  ammo: number;
  horizonalSpeed: number;
  verticalSpeed: number;
  horizonalLimit: number[];
  verticalLimit: number[];
}

export interface TankCannon {
  intname: string;
  name: string;
  secondary?: boolean;
  ammo: number;
  shotFreq: number;
  caliber: number;
  shells?: Shell[];
  belts?: ShellBelt[];
  autoloader?: boolean;
  horizonalSpeed: number | "primary";
  verticalSpeed: number | "primary";
  horizonalLimit: number[] | "primary";
  verticalLimit: number[] | "primary";
  stabilizer?: Stabilizer;
  hullAiming?: HullAiming;
}

//store mby in a diffrent file for each weapon
export interface Shell {
  modname: string;
  intname: string;
  name: string;
  maxamount?: number;
  modmaxamount?: number;
}

export interface ShellBelt {
  modname: string;
  maxamount?: number;
  modmaxamount?: number;
  shells: Belt[];
}

export interface Belt {
  intname: string;
  name: string;
}

export interface HullAiming {
  horizontal?: boolean;
  vertical?: boolean;
  maxRoll: number;
}

export interface Stabilizer {
  shoulderStop?: boolean;
  horizontal?: boolean;
  vertical?: boolean;
  horizontalSpeed?: number;
  verticalSpeed?: number;
}

export interface NightVision {
  commanderViewThermal?: {
    resolution: [500 | 800 | 1200, 300 | 600 | 800];
    noiseFactor: 0.05 | 0.04;
  };
  gunnerThermal?: {
    resolution: [500 | 800 | 1200, 300 | 600 | 800];
    noiseFactor: 0.05 | 0.04;
  };
  driverThermal?: {
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
}

//Final Shop

export type FinalShop = Record<string, FinalShopCountry>;

export interface FinalShopCountry {
  army: FinalShopRange;
  helicopters: FinalShopRange;
  aviation: FinalShopRange;
}

export interface FinalShopRange {
  col_normal: number;
  col_prem: number;
  range: Array<FinalShopItem | FinalShopGroup>[];
}

export interface FinalShopItem {
  name: string;
  rank: number;
  reqAir?: "" | string;
  gift?: true;
  hidden?: true;
  marketplace?: number;
  event?: string;
  clanVehicle?: true;
}

export type FinalShopGroup = {
  name: string;
  image: string;
  reqAir?: "" | string;
  vehicles: FinalShopItem[];
};
