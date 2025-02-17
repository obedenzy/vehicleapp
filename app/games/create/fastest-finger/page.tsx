'use client';

import { templates } from '../templates';
import GameForm from '../[templateId]/game-form';

export default function FastestFingerPage() {
  const template = templates['fastest-finger'];
  return <GameForm template={template} templateId="fastest-finger" />;
}
