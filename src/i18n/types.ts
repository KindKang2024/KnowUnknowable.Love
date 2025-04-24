import * as THREE from 'three';
import {Euler, Vector3} from 'three';

export interface TextSectionProps {
  title?: string;
  subtitle: string;
  position: Vector3;
  cameraRailDist: number;
}


export interface CloudProps {
  scale?: Vector3;
  position: Vector3;
  rotation?: Euler;
  sceneOpacity: React.MutableRefObject<number>;
}

export interface BackgroundProps {
  backgroundColors: React.MutableRefObject<{
    colorA: string;
    colorB: string;
  }>;
}

export interface PlayContextType {
  play: boolean;
  setPlay: (play: boolean) => void;
  end: boolean;
  setEnd: (end: boolean) => void;
  hasScroll: boolean;
  setHasScroll: (hasScroll: boolean) => void;
}

export interface Kana {
  name: string;
  character: {
    hiragana: string;
    katakana: string;
  };
  dakuten: boolean;
  handakuten: boolean;
  combination: boolean;
  correct?: boolean;
}


export type RingItem = {
  name: string;
  symbol: string;
  num: number;
}

export type CompassRingData = {
  innerRing: number;
  outerRing: number;
  lineWidth: number;
  circleWidth: number[];
  lineNum: number;
  offsetX: number;
  offsetY: number;
  size: number;
  direction: number;
  duration: number;
  dataKey: string;
  ringItems?: RingItem[];
}

export type WillState = {
  type: PointWillType;
  position: THREE.Vector3;
  color?: THREE.Color;
}

export type PointUserData = {
  index: number;
  pointEvolveType: PointEvolveType;
  pointType: PointWillType;
  goal: WillState;
}

export enum PointWillType {
  TAIJI = 'will_of_taiji',
  HEAVEN = 'will_of_heaven',
  EARTH = 'will_of_earth',
  HUMANITY = 'will_of_humanity',
  HEAVEN_REMINDER = 'will_of_heaven_reminder',
  EARTH_REMINDER = 'will_of_earth_reminder',
  UNKNOWABLE = 'will_of_unknowable',
}

export enum PointEvolveType {
  FREE = 'free',
  DIRECTED = 'directed',
}

export interface NavItem {
  path: string;
  label: string;
  icon?: React.FC<{ className?: string }>;
}



export type InteractionType = "claim" | "entry";


export enum Trigram {
  Heaven_Qian_1_ALM, // 1 ☰ Qian - Heaven/Sky suggest 2.5%
  Lake_Dui_2_Nation, // 2 ☱ Dui - Lake/Marsh  suggest 2.5% . (no more than 5% total, need compete with others who do not give; maybe a fitness loss if kindness do not begets kindness)
  Fire_Li_3_Community, //3 ☲ Li - Fire, Community, Currently has Lottery, currently be like marketing
  Thunder_Zhen_4_Builders, //4 ☳ Zhen - Thunder, Other Creators That Are Building for Duki in Action
  Wind_Xun_5_Contributors, //5 ☴ Xun - Wind/Wood, Contributors
  Water_Kan_6_Investors, // 6  ☵ Kan - Water, investors
  Mountain_Gen_7_Maintainers, // 7 ☶ Gen - Mountain, creators, #may need pay taxes
  Earth_Kun_8_Creators // 8 ☷ Kun - Earth, survival and existence, sin,

}



export type Qualification = {
  title: string;
  requirements_text: string;
  note: string;
  actions?: InteractionType[];
}


export interface Section {
  id: string;
  bid: string;
  ch_symbol: string;
  cn_seq: number;
  arr_index: number;
  seq: number;
  percentage: number;
  color: string;
  opacity: number;
  title?: string;
  description?: string;
  target?: string;
  claimQualification?: Qualification;
  supportClaimed: boolean;
}

const publicLoveLoveColor = "#b31900";
const privateLoveSinColor = "#FACC15";
const daoLoveColor = "#C084FC";

export const getWillColor = (number: number): string => {
  if (number === 8) {
    return daoLoveColor;
  }
  return number <= 4 ? publicLoveLoveColor : privateLoveSinColor;
}


export const DualityDaoLoveSection: Section =
{
  id: 'Dao',
  bid: '☯',
  ch_symbol: '',
  cn_seq: 9,
  seq: 8,
  supportClaimed: false,
  arr_index: 0,
  percentage: 100,
  color: "#C084FC",
  opacity: 1,

}

export const BaguaSections: Section[] = [
  {
    id: 'Earth',
    bid: "000",
    ch_symbol: 'Kun',
    cn_seq: 8,
    seq: 0,
    arr_index: 5,
    supportClaimed: true,
    percentage: 25,
    color: privateLoveSinColor,
    opacity: 1,
  },
  {
    id: 'Mountain',
    bid: "001",
    ch_symbol: 'Gen',
    cn_seq: 7,
    seq: 1,
    arr_index: 6,
    supportClaimed: true,
    percentage: 25,
    color: privateLoveSinColor,
    opacity: 0.75,
  },
  {
    id: 'Water',
    bid: "010",
    ch_symbol: 'Kan',
    cn_seq: 6,
    seq: 2,
    arr_index: 7,
    supportClaimed: true,
    percentage: 0,
    color: privateLoveSinColor,
    opacity: 0.5,
  },
  {
    id: 'Wind',
    bid: "011",
    ch_symbol: 'Xun',
    cn_seq: 5,
    seq: 3,
    arr_index: 8,
    supportClaimed: true,
    percentage: 0,
    color: privateLoveSinColor,
    opacity: 0.25,
  },

  {
    id: 'Thunder',
    bid: "100",
    ch_symbol: 'Zhen',
    cn_seq: 4,
    seq: 4,
    arr_index: 4,
    supportClaimed: true,
    percentage: 0,
    color: publicLoveLoveColor,
    opacity: 0.75,
  },
  {
    id: 'Fire',
    bid: "101",
    ch_symbol: 'Li',
    cn_seq: 3,
    seq: 5,
    arr_index: 3,
    supportClaimed: true,
    percentage: 0,
    color: publicLoveLoveColor,
    opacity: 0.75,

  },
  {
    id: 'Marsh',
    bid: "110",
    ch_symbol: 'Dui',
    cn_seq: 2,
    seq: 6,
    arr_index: 2,
    supportClaimed: false,
    percentage: 2.5,
    color: publicLoveLoveColor,
    opacity: 0.75,
  },

  {
    id: 'Heaven',
    bid: "111",
    ch_symbol: 'Qian',
    cn_seq: 1,
    seq: 7,
    arr_index: 1,
    supportClaimed: true,
    percentage: 2.5,
    color: publicLoveLoveColor,
    opacity: 1,
  },
  DualityDaoLoveSection,
];