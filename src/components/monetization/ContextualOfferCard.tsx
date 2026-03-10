'use client';

import { isEnabled } from '@/lib/flags';
import type { PartnerOffer } from '@/lib/commerce-triggers';

interface ContextualOfferCardProps {
  offers: PartnerOffer[];
}

/**
 * Renders contextual partner offers that pass the "Gratitude Test":
 * Would the homeowner thank us for showing this?
 *
 * Only renders when affiliate links are enabled via feature flag.
 * Designed to feel like a helpful suggestion, not an ad.
 */
export function ContextualOfferCard({ offers }: ContextualOfferCardProps) {
  if (!isEnabled('ENABLE_AFFILIATE_LINKS') || offers.length === 0) return null;

  return (
    <div style={{ marginTop: '16px' }}>
      <p
        style={{
          fontSize: '10px',
          fontWeight: 600,
          color: 'var(--text-dim)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '8px',
        }}
      >
        Recommended for this project
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {offers.map((offer) => (
          <a
            key={offer.id}
            href={`${offer.href}?ref=homeprojectiq`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              borderRadius: '12px',
              background: 'var(--glass)',
              border: '1px solid var(--glass-border)',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--accent-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                flexShrink: 0,
              }}
            >
              {offer.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'var(--text)',
                  lineHeight: 1.3,
                }}
              >
                {offer.headline}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--text-sub)',
                  lineHeight: 1.3,
                  marginTop: '2px',
                }}
              >
                {offer.description}
              </div>
            </div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--accent)',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {offer.cta} →
            </div>
          </a>
        ))}
      </div>
      <p
        style={{
          fontSize: '9px',
          color: 'var(--text-dim)',
          marginTop: '6px',
          textAlign: 'center',
        }}
      >
        Partner recommendations · We may earn a commission
      </p>
    </div>
  );
}
