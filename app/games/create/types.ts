export interface GameField {
  name: string;
  label: string;
  type: 'number' | 'text' | 'switch' | 'select';
  defaultValue: string | number | boolean;
  min?: string;
  max?: string;
  step?: string;
  options?: { value: string; label: string; }[];
  showIf?: (data: Record<string, any>) => boolean;
}

export interface GameTemplate {
  title: string;
  description: string;
  icon: string;
  features: string[];
  fields: GameField[];
}

export interface GameFormData {
  title: string;
  description: string;
  image: string | null;
  config: Record<string, any>;
}
