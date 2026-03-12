'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PropertySetup } from '@/components/features/property/PropertySetup';
import { useProperties } from '@/hooks/useProperties';
import { ROUTES } from '@/lib/constants';
import { useRouter } from 'next/navigation';

export function PropertyListClient() {
  const router = useRouter();
  const { properties, isLoading } = useProperties();
  const [showSetup, setShowSetup] = useState(false);

  return (
    <>
      <Navbar title="Properties" showBack backHref={ROUTES.DASHBOARD} />
      <PageWrapper>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[var(--text)]">My Properties</h2>
            <Button size="sm" onClick={() => setShowSetup(true)}>+ Add</Button>
          </div>

          {showSetup && (
            <PropertySetup onComplete={() => setShowSetup(false)} />
          )}

          {isLoading ? (
            <div className="text-sm text-[var(--text-sub)]">Loading...</div>
          ) : properties.length === 0 && !showSetup ? (
            <Card padding="lg" className="text-center">
              <span className="text-4xl">🏠</span>
              <h3 className="text-lg font-semibold text-[var(--text)] mt-3">No properties yet</h3>
              <p className="text-sm text-[var(--text-sub)] mt-1">Add your first property to get started</p>
              <Button className="mt-4" onClick={() => setShowSetup(true)}>Add Property</Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {properties.map((property) => (
                <Card key={property.id} variant="interactive" padding="md" onClick={() => router.push(`${ROUTES.PROPERTY}/${property.id}`)}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🏠</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[var(--text)]">{property.name}</p>
                      <div className="flex items-center gap-2 text-xs text-[var(--text-sub)]">
                        {property.home_type && <span className="capitalize">{property.home_type.replace('_', ' ')}</span>}
                        {property.year_built && <span>· Built {property.year_built}</span>}
                        {property.square_footage && <span>· {property.square_footage.toLocaleString()} sqft</span>}
                      </div>
                    </div>
                    <span className="text-[var(--text-sub)]">→</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </PageWrapper>
    </>
  );
}
