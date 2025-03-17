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
  ch_symbol: string;
  arr_index: number;
  seq: number;
  percentage: number;
  color: string;
  opacity: number;
  title?: string;
  description?: string;
  target?: string;
  claimQualification?: Qualification;
  hasClaimed: boolean;
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
  ch_symbol: 'DUKI',
  seq: 8,
  hasClaimed: false,
  arr_index: 0,
  percentage: 100,
  color: "#C084FC",
  opacity: 1,
  // title: 'Love Be Ye Way',
  // description: 'Dao is Love.',
  // target: "to free will. Free will are born of love and born with sin, it needs power and wisdom to be useful",
  // claimQualification: {
  //   title: "Claim",
  //   requirements_text: "DUKI for all lives in that community",
  //   note: "Fairness always, those who love and care for the world indeed deserves more DUKI"
  // }
}

export const BaguaSections: Section[] = [
  {
    id: 'Earth',
    ch_symbol: 'Kun',
    seq: 0,
    arr_index: 5,
    hasClaimed: true,
    percentage: 25,
    color: privateLoveSinColor,
    opacity: 1,
    // title: 'Private Love For Creators',
    // description: 'Wills Receptivity and Nurturing',
    // target: "Money to DUKIGE - We need sin first for survival and then evolve to be love",
    // claimQualification: {
    //   title: "Claim",
    //   requirements_text: "DUKI for all lives in that community",
    //   note: "Fairness always, those who love and care for the world indeed deserves more DUKI"
    // }
  },
  {
    id: 'Mountain',
    ch_symbol: 'Gen',
    seq: 1,
    arr_index: 6,
    hasClaimed: true,
    percentage: 25,
    color: privateLoveSinColor,
    opacity: 0.75,
    // title: 'Private Love For Maintainers',
    // description: 'Wills Stillness and Meditation',
    // target: "Money to Founders - Fairness Always! We need visionary creators to evolve.",
    // claimQualification: {
    //   title: "Claim",
    //   requirements_text: "DUKI for all lives in that community",
    //   note: "Fairness always, those who love and care for the world indeed deserves more DUKI"
    // }
  },
  {
    id: 'Water',
    ch_symbol: 'Kan',
    seq: 2,
    arr_index: 7,
    hasClaimed: true,
    percentage: 0,
    color: privateLoveSinColor,
    opacity: 0.5,
    // title: 'Private Love For Investors',
    // description: 'Wills Flow and Adaptation',
    // target: "Money to Investors - Free Will of Goodness needs power to manifest and be useful",
    // claimQualification: {
    //   title: "Claim",
    //   requirements_text: "DUKI for all lives in that community",
    //   note: "Fairness always, those who love and care for the world indeed deserves more DUKI"
    // }
  },
  {
    id: 'Wind',
    ch_symbol: 'Xun',
    seq: 3,
    arr_index: 8,
    hasClaimed: true,
    percentage: 0,
    color: privateLoveSinColor,
    opacity: 0.25,
    // title: 'Private Love For Contributors',
    // description: 'Wills Influence and Penetration',
    // target: "Money to Partners - Fostering strategic collaborations and alliances",
    // claimQualification: {
    //   title: "Claim",
    //   requirements_text: "DUKI for all lives in that community",
    //   note: "Fairness always, those who love and care for the world indeed deserves more DUKI"
    // }
  }, 
  
  {
    id: 'Thunder',
    ch_symbol: 'Zhen',
    seq: 4,
    arr_index: 4,
    hasClaimed: true,
    percentage: 0,
    color: publicLoveLoveColor,
    opacity: 0.75,
    // title: 'Public Love For Builders',
    // description: 'Wills Initiative and Action',
    // target: "Money to Community - Nurturing active and engaged user base",
    // claimQualification: {
    //   title: "Claim",
    //   requirements_text: "DUKI for all lives in that community",
    //   note: "Fairness always, those who love and care for the world indeed deserves more DUKI"
    // }
  },
  {
    id: 'Fire',
    ch_symbol: 'Li',
    seq: 5,
    arr_index: 3,
    hasClaimed: true,
    percentage: 0,
    color: publicLoveLoveColor,
    opacity: 0.75,
    // title: 'Public Love For Community',
    // description: 'Wills Clarity and Transformation',
    // target: "Money to Pioneers - First adopters and adventurers are the pioneers of the world",
    // claimQualification: {
    //   title: "Claim",
    //   requirements_text: "DUKI for all lives in that community",
    //   note: "Fairness always, those who love and care for the world indeed deserves more DUKI"
    // }
  },
  {
    id: 'Marsh',
    ch_symbol: 'Dui',
    seq: 6,
    arr_index: 2,
    hasClaimed: false,
    percentage: 2.5,
    color: publicLoveLoveColor,
    opacity: 0.75,
    // title: 'Public Love For Nation',
    // description: 'Wills Joy and Satisfaction',
    // target: "Money to Nation - A nation of people who love and care for the world",
    // claimQualification:
    // {
    //   title: "Claim",
    //   requirements_text: "DUKI for all lives in that nation",
    //   note: "Fairness always, those who love and care for the world indeed deserves more DUKI"
    // }
  },
  
  {
    id: 'Heaven',
    seq: 7,
    ch_symbol: 'Qian',
    hasClaimed: true,
    arr_index: 1,
    percentage: 2.5,
    color: publicLoveLoveColor,
    opacity: 1,
    // title: 'Public Love For All Lives',
    // description: 'Wills Humanity and Creativity',
    // target: "Money to World - DUKI in Action to remind all lives that freedom is not free, it needs power to reject evil and do good",
    // claimQualification:
    // {
    //   title: "Claim",
    //   requirements_text: "DUKI as First Kindness for all lives. ",
    //   note: "All we need a human uniqueness zero-knowledge proof system for the world to Make All Great Again(Like WLD but backed by decentralized authorities that welcome critisism). Currently we use wallet and unstoppable domain to uniquely identify you",
    // }
  },
  DualityDaoLoveSection,
];