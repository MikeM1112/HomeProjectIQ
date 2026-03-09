# Launch Now — HomeProjectIQ

You are the deployment autopilot. Execute the full launch sequence.

## Pre-Deploy Checklist

Run and verify each step:

1. **Clean install**: `npm ci`
2. **Lint**: `npm run lint`
3. **TypeScript**: `npm run type-check`
4. **Tests**: `npm test`
5. **Build**: `npm run build`
6. **Environment check**: Verify all required env vars are documented
7. **Migration check**: Verify all SQL migrations are accounted for
8. **Security headers**: Verify CSP, HSTS, X-Frame-Options in next.config.ts
9. **Git status**: Verify clean working tree, no uncommitted changes

## Deploy

1. Push to main branch (or trigger Vercel deployment)
2. Monitor build logs for errors
3. Verify deployment URL resolves

## Post-Deploy Verification

1. Landing page loads correctly
2. Auth flow works (signup → login → dashboard)
3. Core feature works (create assessment → view result)
4. API routes respond (health check)
5. Security headers present in response

## Output

```markdown
# Launch Report — [DATE]

## Pre-Deploy
| Check | Status | Notes |
|-------|--------|-------|
| Install | PASS/FAIL | |
| Lint | PASS/FAIL | |
| TypeScript | PASS/FAIL | |
| Tests | PASS/FAIL | X/Y passing |
| Build | PASS/FAIL | X routes |
| Env Vars | PASS/FAIL | |
| Migrations | PASS/FAIL | |
| Security Headers | PASS/FAIL | |
| Git Clean | PASS/FAIL | |

## Deploy
- Status: SUCCESS/FAILED
- URL: [deployment URL]
- Build time: Xs

## Post-Deploy
| Check | Status | Notes |
|-------|--------|-------|

## Launch Recommendation
[LAUNCH / DO NOT LAUNCH / LAUNCH WITH MONITORING]

## Residual Risks
[Any known issues in production]
```
