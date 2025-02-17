'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Template Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The requested game template does not exist.
        </p>
        <Link href="/games/templates">
          <Button>Return to Templates</Button>
        </Link>
      </div>
    </div>
  );
}
