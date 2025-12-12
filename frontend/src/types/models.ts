export type OpenAIModel = 
  | 'gpt-4-turbo-preview'
  | 'gpt-4-1106-preview'
  | 'gpt-4-0125-preview'
  | 'gpt-3.5-turbo-1106'
  | 'gpt-3.5-turbo-0125';

export interface ModelOption {
  value: OpenAIModel;
  label: string;
  description: string;
  costTier: 'high' | 'medium' | 'low';
}

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    value: 'gpt-4-turbo-preview',
    label: 'GPT-4 Turbo (Recommended)',
    description: 'Most capable, best quality',
    costTier: 'high'
  },
  {
    value: 'gpt-4-1106-preview',
    label: 'GPT-4 Turbo (1106)',
    description: 'High quality, stable version',
    costTier: 'high'
  },
  {
    value: 'gpt-4-0125-preview',
    label: 'GPT-4 Turbo (0125)',
    description: 'Latest GPT-4 improvements',
    costTier: 'high'
  },
  {
    value: 'gpt-3.5-turbo-1106',
    label: 'GPT-3.5 Turbo (1106)',
    description: 'Faster, lower cost',
    costTier: 'low'
  },
  {
    value: 'gpt-3.5-turbo-0125',
    label: 'GPT-3.5 Turbo (0125)',
    description: 'Latest GPT-3.5, lower cost',
    costTier: 'low'
  }
];

export const DEFAULT_MODEL: OpenAIModel = 'gpt-4-turbo-preview';

