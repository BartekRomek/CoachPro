export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
}

export interface AppEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'Trening' | 'Mecz' | 'Odprawa';
  location: string;
  lineup?: Record<string, string | null>;
}

export interface BaseSkills {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
}

export interface PlayerStats {
  goals: number;
  assists: number;
  minutes: number;
}

export interface Player {
  id: string;
  name: string;
  position: string;
  baseSkills: BaseSkills;
  stats: PlayerStats;
  isInjured?: boolean;
  photoUrl?: string;
  accessCode?: string;
}

export interface Message {
  id: string;
  playerId: string;
  date: string;
  content: string;
  read: boolean;
}

export interface CoachSettings {
  enableParentModule: boolean;
}

export interface TrainingSession {
  id: string;
  date: string;
  type: string;
}

export interface PerformanceSliders {
  engagement: number;
  tactics: number;
  technique: number;
}

export interface TrainingAttendance {
  id: string;
  trainingId: string;
  playerId: string;
  isPresent: boolean;
  performanceSliders?: PerformanceSliders;
}

export type Lineup = Record<string, string | null>; // slotId -> playerId

export interface TrainingReport {
  id: string;
  eventId: string;
  date: string;
  title: string;
  attendances: TrainingAttendance[];
  createdAt: string;
}
