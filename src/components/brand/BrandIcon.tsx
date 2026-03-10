'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

export type BrandIconName =
  | 'plan-fix'
  | 'cost-savings'
  | 'project-done'
  | 'diagnose'
  | 'time'
  | 'tools'
  | 'hire-pro';

interface BrandIconProps {
  name: BrandIconName;
  size?: number;
  className?: string;
}

const iconLabels: Record<BrandIconName, string> = {
  'plan-fix': 'Plan & Fix',
  'cost-savings': 'Cost Savings',
  'project-done': 'Project Done',
  diagnose: 'Diagnose',
  time: 'Time',
  tools: 'Tools',
  'hire-pro': 'Hire Pro',
};

export function BrandIcon({ name, size = 48, className }: BrandIconProps) {
  return (
    <Image
      src={`/brand/icon-${name}.png`}
      alt={iconLabels[name]}
      width={size}
      height={size}
      className={cn('object-contain', className)}
    />
  );
}
