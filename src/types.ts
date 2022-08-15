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
  country: string;
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
}

export interface VehiclePhys {
  Mass: Mass;
  tracks: VehiclePhysTracks;
  engine: Engine;
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
  Weapon: Weapon[];
}

export interface Weapon {
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
  Shop: Shop;
  operatorCountry?: string;
}

export interface Shop {
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
