'use client';

import { templates } from '../templates';
import GameForm from '../[templateId]/game-form';

export default function BadgeGuessPage() {
  const template = templates['badge-guess'];
  return <GameForm template={template} templateId="badge-guess" />;
}
