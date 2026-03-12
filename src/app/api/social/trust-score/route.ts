import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // tool_loans uses user_id as the lender
  const { data: loans } = await supabase
    .from('tool_loans')
    .select('id, status, due_date, return_date')
    .eq('user_id', user.id);

  const allLoans = loans ?? [];
  const totalLent = allLoans.length;
  const activeLent = allLoans.filter((l) => l.status === 'out').length;
  const returnedLoans = allLoans.filter((l) => l.status === 'returned');
  const overdueLoans = allLoans.filter((l) => l.status === 'overdue');

  // On-time returns: returned before or on due_date
  const onTimeReturns = returnedLoans.filter((l) => {
    if (!l.return_date || !l.due_date) return true;
    return new Date(l.return_date) <= new Date(l.due_date);
  }).length;

  const onTimePercent = returnedLoans.length > 0
    ? Math.round((onTimeReturns / returnedLoans.length) * 100)
    : 100;

  // Lender score: base 50, +10 per loan completed, -10 per overdue
  const lenderScore = Math.min(100, Math.max(0,
    50 + returnedLoans.length * 10 - overdueLoans.length * 10
  ));

  // Overall trust (single-user model since borrower is just a name string)
  const overallScore = totalLent > 0 ? lenderScore : 50;

  return NextResponse.json({
    user_id: user.id,
    overall_score: overallScore,
    lender: {
      score: lenderScore,
      total_loans: totalLent,
      active_loans: activeLent,
    },
    borrower: {
      score: onTimePercent,
      total_loans: returnedLoans.length,
      returned: returnedLoans.length,
      on_time_percent: onTimePercent,
    },
    trust_level: overallScore >= 80 ? 'high' : overallScore >= 50 ? 'medium' : 'low',
  });
}
