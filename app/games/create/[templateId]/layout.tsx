'use client';

import type { Metadata } from 'next';
import { templates } from '../templates';

export const metadata: Metadata = {
  title: 'Create Game',
  description: 'Create a new vehicle identification game'
};

export function generateStaticParams() {
  return Object.keys(templates).map(templateId => ({ templateId }));
}

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
