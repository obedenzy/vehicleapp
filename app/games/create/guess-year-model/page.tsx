'use client';

import { templates } from '../templates';
import GameForm from '../[templateId]/game-form';

export default function GuessYearModelPage() {
  const template = templates['guess-year-model'];
  return <GameForm template={template} templateId="guess-year-model" />;
}
