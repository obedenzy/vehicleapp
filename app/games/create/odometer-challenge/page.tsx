'use client';

import { templates } from '../templates';
import GameForm from '../[templateId]/game-form';

export default function OdometerChallengePage() {
  const template = templates['odometer-challenge'];
  return <GameForm template={template} templateId="odometer-challenge" />;
}
