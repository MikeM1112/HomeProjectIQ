'use client';

import { Navbar } from '@/components/layout/Navbar';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { ZoneManager } from '@/components/features/property/ZoneManager';
import { SystemTracker } from '@/components/features/property/SystemTracker';
import { useProperties } from '@/hooks/useProperties';
import { ROUTES } from '@/lib/constants';

export function PropertyDetailClient({ propertyId }: { propertyId: string }) {
  const { properties, isLoading } = useProperties();
  const property = properties.find((p) => p.id === propertyId);

  if (isLoading) {
    return (
      <>
        <Navbar title="Property" showBack backHref={ROUTES.PROPERTY} />
        <PageWrapper><div className="text-sm text-[var(--text-sub)]">Loading...</div></PageWrapper>
      </>
    );
  }

  return (
    <>
      <Navbar title={property?.name ?? 'Property'} showBack backHref={ROUTES.PROPERTY} />
      <PageWrapper>
        <div className="space-y-6">
          {property && (
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-[var(--text)]">{property.name}</h2>
              <div className="flex flex-wrap gap-3 text-sm text-[var(--text-sub)]">
                {property.home_type && <span className="capitalize">{property.home_type.replace('_', ' ')}</span>}
                {property.year_built && <span>Built {property.year_built}</span>}
                {property.square_footage && <span>{property.square_footage.toLocaleString()} sqft</span>}
                {property.bedrooms != null && <span>{property.bedrooms} bed</span>}
                {property.bathrooms != null && <span>{property.bathrooms} bath</span>}
              </div>
              {property.address && <p className="text-xs text-[var(--text-sub)]">{property.address}</p>}
            </div>
          )}

          <ZoneManager propertyId={propertyId} />
          <SystemTracker propertyId={propertyId} />
        </div>
      </PageWrapper>
    </>
  );
}
