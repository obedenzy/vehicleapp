'use client';

import { templates } from '../templates';
import GameForm from './game-form';
import { notFound } from 'next/navigation';

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(templates).map(templateId => ({ templateId }));
}

export default function CreateGamePage({ params }: { params: { templateId: string } }) {
  const template = templates[params.templateId as keyof typeof templates];

  if (!template) {
    notFound();
  }

  return <GameForm template={template} templateId={params.templateId} />;
}
