
export interface VibePalette {
  name: string;
  color: string;
}

export interface Hairstyle {
  id: string;
  name: string;
  description: string;
}

export interface GenerationResult {
  beforeUrl: string;
  afterUrl: string;
  technique: string;
  colorName: string;
  styleName: string;
}

export interface LeadData {
  FullName: string;
  ContactPhone: string;
  BusinessEmail: string;
  BusinessName: string;
  EmployeeSize: '1-3' | '4-10' | '11-25' | '25+';
}

// Fixed missing Technique enum for constants.tsx
export enum Technique {
  BALAYAGE = 'BALAYAGE',
  BLEACH_TONE = 'BLEACH_TONE',
  MONEY_PIECE = 'MONEY_PIECE',
  FANTASY = 'FANTASY',
}
