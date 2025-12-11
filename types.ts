export interface Subject {
  id: string;
  name: string;
  targetGrade: number;
  currentGrade: number;
  color: string;
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  date: string; // ISO date string
  status: 'passed' | 'upcoming' | 'ready';
  tags?: string[];
  content?: string;
}

export interface Goal {
  id: string;
  type: 'short' | 'mid' | 'long';
  title: string;
  description: string;
  metric?: {
    label: string;
    value: string | number;
    target?: string | number;
  };
  icon?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface WizardData {
  title: string;
  subject: string;
  date: string;
  contentTypes: string[];
}

export enum StepStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}