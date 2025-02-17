import type { GameTemplate, GameField } from './types';

export const templates: Record<string, GameTemplate> = {
  'guess-year-model': {
    title: 'Guess the Year & Model',
    description: 'Create a game where players guess the exact year and model of a car.',
    icon: 'Car',
    features: [
      'Upload car image or take photo',
      'Auto-hide identifying details',
      'First correct guess wins',
      'Real-time leaderboard'
    ],
    fields: [
      { name: 'entryFee', label: 'Entry Fee ($)', type: 'number', defaultValue: '2', min: '0', max: '100', step: '0.5' },
      { name: 'prizePool', label: 'Prize Pool %', type: 'number', defaultValue: '80', min: '1', max: '100' },
      { name: 'timeLimit', label: 'Time Limit (seconds)', type: 'number', defaultValue: '60', min: '10', max: '300' },
      { name: 'allowMultipleGuesses', label: 'Allow Multiple Guesses', type: 'switch', defaultValue: false },
      { name: 'maxGuesses', label: 'Maximum Guesses', type: 'number', defaultValue: '3', min: '1', max: '10', 
        showIf: (data) => data.allowMultipleGuesses },
    ]
  },
  'odometer-challenge': {
    title: 'Odometer Challenge',
    description: 'Create a game where players guess the exact odometer reading from your video.',
    icon: 'Gauge',
    features: [
      'Upload video showing odometer',
      'Set exact odometer reading',
      'One guess per player',
      'Progressive prize pool'
    ],
    fields: [
      { name: 'entryFee', label: 'Entry Fee ($)', type: 'number', defaultValue: '2', min: '0', max: '100', step: '0.5' },
      { name: 'odometerReading', label: 'Exact Odometer Reading in the video', type: 'number', defaultValue: '0', min: '0', max: '999999' },
      { name: 'timeLimit', label: 'Time Limit (seconds)', type: 'number', defaultValue: '45', min: '10', max: '300' },
      { name: 'prizePool', label: 'Prize Pool %', type: 'number', defaultValue: '90', min: '1', max: '100' }
    ]
  },
  'fastest-finger': {
    title: 'Fastest Finger First',
    description: 'Create a speed-based vehicle identification challenge.',
    icon: 'Timer',
    features: [
      'Timed responses',
      'Multiple rounds',
      'Speed-based scoring',
      'Global rankings'
    ],
    fields: [
      { name: 'entryFee', label: 'Entry Fee ($)', type: 'number', defaultValue: '1', min: '0', max: '100', step: '0.5' },
      { name: 'roundDuration', label: 'Round Duration (seconds)', type: 'number', defaultValue: '10', min: '5', max: '60' },
      { name: 'prizePool', label: 'Prize Pool %', type: 'number', defaultValue: '90', min: '1', max: '100' },
      { name: 'requireFullMatch', label: 'Require Exact Match', type: 'switch', defaultValue: true },
      { name: 'roundCount', label: 'Number of Rounds', type: 'number', defaultValue: '5', min: '1', max: '20' },
    ]
  },
  'badge-guess': {
    title: 'Blindfolded Badge Guess',
    description: 'Create a logo identification challenge game.',
    icon: 'Shield',
    features: [
      'Auto-blur technology',
      'Multiple choice options',
      'Progressive difficulty',
      'Brand-specific challenges'
    ],
    fields: [
      { name: 'entryFee', label: 'Entry Fee ($)', type: 'number', defaultValue: '2', min: '0', max: '100', step: '0.5' },
      { name: 'difficultyLevel', label: 'Difficulty Level', type: 'select', defaultValue: '2',
        options: [
          { value: '1', label: 'Easy' },
          { value: '2', label: 'Medium' },
          { value: '3', label: 'Hard' },
          { value: '4', label: 'Expert' },
        ]
      },
      { name: 'timeLimit', label: 'Time Limit (seconds)', type: 'number', defaultValue: '30', min: '10', max: '300' },
      { name: 'progressiveDifficulty', label: 'Progressive Difficulty', type: 'switch', defaultValue: true },
    ]
  }
} as const;
