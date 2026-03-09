import { ImageResponse } from 'next/og';
import { type NextRequest } from 'next/server';

export const runtime = 'edge';

function getVerdictDisplay(verdict: string): { label: string; color: string; bg: string } {
  switch (verdict) {
    case 'diy_easy':
      return { label: 'DIY Easy', color: '#FFFFFF', bg: '#2D8A4E' };
    case 'diy_caution':
      return { label: 'DIY with Caution', color: '#2C2C2C', bg: '#F9A825' };
    case 'hire_pro':
      return { label: 'Lean toward Pro', color: '#FFFFFF', bg: '#D32F2F' };
    default:
      return { label: verdict, color: '#FFFFFF', bg: '#6B6B6B' };
  }
}

function getConfidenceColor(confidence: number): string {
  if (confidence >= 85) return '#2D8A4E';
  if (confidence >= 70) return '#F9A825';
  return '#D32F2F';
}

function formatDollars(cents: number): string {
  const dollars = Math.abs(cents) / 100;
  return `$${dollars.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = (searchParams.get('title') || 'Home Project Assessment').slice(0, 100);
  const confidence = Math.max(0, Math.min(100, parseInt(searchParams.get('confidence') || '0', 10) || 0));
  const rawVerdict = searchParams.get('verdict') || 'diy_easy';
  const verdict = ['diy_easy', 'diy_caution', 'hire_pro'].includes(rawVerdict) ? rawVerdict : 'diy_easy';
  const savings = Math.max(0, parseInt(searchParams.get('savings') || '0', 10) || 0);
  const category = (searchParams.get('category') || '').slice(0, 50);

  const verdictDisplay = getVerdictDisplay(verdict);
  const confColor = getConfidenceColor(confidence);
  const arcAngle = (confidence / 100) * 180;

  // Calculate SVG arc for confidence gauge
  const radius = 60;
  const cx = 100;
  const cy = 80;
  const startAngle = Math.PI;
  const endAngle = startAngle + (arcAngle * Math.PI) / 180;
  const x1 = cx + radius * Math.cos(startAngle);
  const y1 = cy + radius * Math.sin(startAngle);
  const x2 = cx + radius * Math.cos(endAngle);
  const y2 = cy + radius * Math.sin(endAngle);
  const largeArcFlag = arcAngle > 180 ? 1 : 0;

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#F7F5F2',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Top brand bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px 48px',
            backgroundColor: '#FFFFFF',
            borderBottom: '2px solid #E5E0DB',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '36px' }}>🏠</span>
            <span
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: '#2C2C2C',
              }}
            >
              HomeProjectIQ
            </span>
          </div>
          {category && (
            <div
              style={{
                display: 'flex',
                padding: '6px 16px',
                borderRadius: '999px',
                backgroundColor: '#F0EDE8',
                color: '#6B6B6B',
                fontSize: '16px',
                fontWeight: 600,
              }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </div>
          )}
        </div>

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            padding: '40px 48px',
            gap: '48px',
          }}
        >
          {/* Left side - title and verdict */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'center',
              gap: '24px',
            }}
          >
            <h1
              style={{
                fontSize: '42px',
                fontWeight: 700,
                color: '#2C2C2C',
                lineHeight: 1.2,
                margin: 0,
              }}
            >
              {title}
            </h1>

            {/* Verdict badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  padding: '10px 24px',
                  borderRadius: '999px',
                  backgroundColor: verdictDisplay.bg,
                  color: verdictDisplay.color,
                  fontSize: '20px',
                  fontWeight: 700,
                }}
              >
                {verdictDisplay.label}
              </div>
            </div>

            {/* Savings */}
            {savings > 0 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span
                  style={{
                    fontSize: '18px',
                    color: '#6B6B6B',
                  }}
                >
                  Potential savings:
                </span>
                <span
                  style={{
                    fontSize: '28px',
                    fontWeight: 700,
                    color: '#C05E14',
                  }}
                >
                  {formatDollars(savings)}
                </span>
              </div>
            )}

            {/* Tagline */}
            <p
              style={{
                fontSize: '16px',
                color: '#9B9B9B',
                margin: 0,
              }}
            >
              Get your free assessment at homeprojectiq.com
            </p>
          </div>

          {/* Right side - confidence gauge */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '280px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                padding: '32px',
                border: '2px solid #E5E0DB',
                width: '260px',
              }}
            >
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#6B6B6B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  margin: '0 0 16px 0',
                }}
              >
                DIY Confidence
              </p>
              <svg
                width="200"
                height="120"
                viewBox="0 0 200 120"
              >
                {/* Background arc */}
                <path
                  d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
                  fill="none"
                  stroke="#E5E0DB"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                {/* Foreground arc */}
                {confidence > 0 && (
                  <path
                    d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`}
                    fill="none"
                    stroke={confColor}
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                )}
              </svg>
              <span
                style={{
                  fontSize: '56px',
                  fontWeight: 700,
                  color: confColor,
                  marginTop: '-40px',
                }}
              >
                {confidence}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            height: '6px',
            backgroundColor: '#C05E14',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
