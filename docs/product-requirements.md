# Vox Essay Mosaic - Product Requirements Document

**Version:** 1.0
**Date:** January 2026
**Status:** Pre-Launch (Edition One targeting Q2 2026)

---

## Executive Summary

Vox Essay Mosaic is a quarterly personal essay publication featuring 20 curated voices per edition. The current state is a static HTML/CSS/JS marketing site with no backend infrastructure. This document defines what needs to be built across seven functional areas, with clear MVP/V1/Future phasing appropriate for a bootstrapped operation.

### Current State Assessment

**What exists today:**
- Static marketing site (7 HTML pages)
- Email signup form (client-side only, no backend connection)
- Author profile template (single sample: Elena Ruiz)
- Submission process via email (submit@voxmosaic.com)
- Editorial documentation (guidelines, contributor agreement, calendar)

**What does NOT exist:**
- Email service integration
- Any backend or database
- User accounts or authentication
- CMS for content management
- Analytics
- Payment processing

---

## 1. USER ACCOUNT SYSTEM

### Strategic Recommendation: Defer User Accounts

**Key Insight:** User accounts add complexity with minimal value at this stage. The primary user flows (reading essays, signing up for email, submitting essays) do not require authentication.

#### Who Might Need Accounts?

| User Type | Account Need | Recommendation |
|-----------|--------------|----------------|
| Readers | Low - free content, no personalization | Defer |
| Submitting Authors | Medium - track submission status | Use email-based workflow |
| Published Authors | Medium - update profile/bio | Manual via email |
| Admin/Editor | High - manage submissions, publish | Use existing tools |

#### MVP: No User Accounts

- Continue email-based workflows
- Use email address as identifier for newsletter
- Submissions tracked in spreadsheet (as noted in editorial calendar)
- Author profile updates handled via email to editor

#### V1: Optional Author Portal (Post-Launch, If Needed)

Only build if pain points emerge:
- Magic link authentication (no passwords)
- Author can view: submission status, essay analytics, update bio/links
- Store: email, name, bio, headshot URL, social links, submission history

**Build vs. Buy:** If accounts needed, use Auth0 or Supabase Auth (free tiers available)

#### Future: Reader Accounts

Only if implementing:
- Reading progress/bookmarks
- Premium content gating
- Community features (comments, discussions)

---

## 2. SUBMISSION SYSTEM

### Current State

Email-based submissions to submit@voxmosaic.com with manual tracking in spreadsheet.

### MVP: Enhanced Email Workflow (Minimal Build)

**What to build:**
- Nothing new for submission intake - email works fine for 20-50 submissions/edition
- Use email templates for consistent responses:
  - Acknowledgment (within 48 hours)
  - Decision notification
  - Revision requests

**What to buy/use:**
- Google Forms or Tally.so as optional backup intake (free)
- Airtable or Notion for submission tracking (free tier)

**Rationale:** Building a submission portal before validating author interest is premature. Email creates personal touch that matches brand positioning.

### V1: Structured Intake Form

**Trigger to build:** When volume exceeds 50 submissions/edition or email management becomes painful.

**What to build:**
- Web form collecting: essay file upload (or Google Doc link), author name, email, bio, headshot, social links
- Auto-confirmation email
- Admin view to browse/filter submissions

**What to buy:**
- Airtable with form feature, or
- Typeform/Tally with Airtable backend, or
- Simple custom form with Supabase backend

### Future: Full Author Dashboard

**Trigger:** Revenue from premium tiers or 100+ submissions/edition

**Features:**
- Author login (magic link)
- View submission history and status
- Edit profile information
- View essay read counts and analytics
- Access to promotional assets

---

## 3. EMAIL/NEWSLETTER INFRASTRUCTURE

### Critical Priority - Required Before Launch

**This is the highest-priority technical build.** The current form does nothing - emails are logged to console only.

### MVP: Basic Newsletter Integration (Required Now)

**What to build:**
- Connect signup form to email service
- Welcome email automation
- Basic email template matching site design

**Recommended Service: Buttondown**

| Service | Free Tier | Why Consider |
|---------|-----------|--------------|
| Buttondown | 100 subscribers | Simple, writer-focused, affordable ($9/mo for 1K) |
| ConvertKit | 1,000 subscribers | Better automation, but more complex |
| Mailchimp | 500 subscribers | Industry standard, but bloated for this use case |

**Implementation:**
```javascript
// Replace console.log with API call
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = this.querySelector('input[type="email"]').value;
  await fetch('https://api.buttondown.email/v1/subscribers', {
    method: 'POST',
    headers: { 'Authorization': 'Token YOUR_API_KEY' },
    body: JSON.stringify({ email })
  });
});
```

### V1: List Segmentation and Automation

**Lists to maintain:**
1. **Readers** - Signed up via homepage (general interest)
2. **Authors/Writers** - Indicated interest in submitting
3. **Contributors** - Published authors (manual add)

**Automations:**
- Welcome sequence (1-3 emails introducing Vox Mosaic)
- Submission confirmation (when using web form)
- Launch announcement (to all lists)
- Author spotlight series (during launch week)

### Future: Advanced Email Features

- Personalized recommendations
- Edition-specific lists
- A/B testing
- Paid subscription tier via email

---

## 4. CONTENT MANAGEMENT SYSTEM

### Current State

Static HTML files. Each author page must be manually created by duplicating author.html template.

### MVP: Static Site Generator

**What to build:**
- Migrate to static site generator (Astro, 11ty, or Hugo)
- Create reusable author template
- Create essay page template
- Content in Markdown files

**Why this approach:**
- Maintains current hosting simplicity (GitHub Pages, Netlify, Vercel)
- No CMS vendor lock-in
- Fast, secure, cheap
- Matches quarterly cadence (updates are batch, not continuous)

**Recommended: Astro**
- Modern, fast, component-based
- Works with existing CSS
- Markdown content with frontmatter
- Easy image optimization

### V1: Headless CMS Layer

**Trigger:** Non-technical editor needs to update content, or scaling past 2 editions becomes unwieldy.

**Options:**
| CMS | Free Tier | Best For |
|-----|-----------|----------|
| Decap CMS (formerly Netlify CMS) | Unlimited | Git-based, editor UI over Markdown |
| Sanity | 2 users | Structured content, real-time |
| Contentful | 5 users | Enterprise-ready, API-first |

**Recommendation: Decap CMS**
- Stays git-based (no new database)
- Visual editing interface
- Works with any static site generator
- Free

### Future: Full Publishing Platform

Only if transforming into a full media operation:
- Custom CMS
- Scheduled publishing
- Version history
- Multi-editor workflow

---

## 5. READING EXPERIENCE

### Current State

No reading experience exists - essays are not yet published. Only excerpts and author previews.

### MVP: Clean Essay Pages (Required for Launch)

**What to build:**
- Essay page template (full essay text)
- Reading-optimized typography (already established in design system)
- Social sharing buttons
- "Read Next" navigation between essays
- Downloadable PDF of full edition

**Key design decisions:**
- No gating on Edition One (confirmed in FAQ: "completely free")
- No account required to read
- No reading progress tracking initially

### V1: Enhanced Reading Features

**Social Sharing:**
- Twitter/X share button (pre-populated with essay title + author)
- Copy link button
- Email to a friend

**Navigation:**
- Table of contents for edition
- Progress indicator (scroll position)
- Previous/Next essay links
- Return to mosaic grid

### Future: Personalized Reading

**Only if building premium tier:**
- Reading progress sync (requires accounts)
- Bookmarks and highlights
- Notes feature
- Offline reading (PWA)

---

## 6. ANALYTICS & TRACKING

### MVP: Basic Analytics (Required Before Launch)

**What to track:**
- Page views (homepage, author pages, essays)
- Email signups (conversion rate)
- Traffic sources
- Device/browser breakdown

**Recommended: Plausible Analytics**
- Privacy-friendly (no cookie banner needed)
- Simple, clean dashboard
- $9/month (worth it) or self-host free
- Already noted in editorial calendar as planned

**Alternative:** Vercel Analytics (if hosting on Vercel) - included free

### V1: Conversion Funnel Tracking

**Key funnels to track:**
1. Homepage > Signup
2. Author Page > Signup
3. Submit Page > (email submission - harder to track)
4. Any Page > Download PDF

**Events to track:**
- Scroll depth on essay pages (did they read it?)
- Time on page
- CTA button clicks
- PDF downloads

### Future: Per-Essay Analytics (For Author Revenue Share)

**What to track:**
- Unique readers per essay
- Average time spent per essay
- Social shares per essay
- Referral sources per essay

**Why this matters:** The contributor agreement mentions "pro-rata share" of future revenue. You'll need per-essay metrics to calculate this.

**Implementation:** Custom event tracking per essay, stored in database (requires backend).

---

## 7. PAYMENT/MONETIZATION

### Current State

No payment infrastructure. Edition One is explicitly free.

### MVP: No Payment Required

**Rationale:**
- Edition One is free (confirmed in FAQ)
- No upfront author payment (confirmed in agreement)
- Focus on building audience before monetizing

**Do NOT build payment infrastructure for MVP.**

### V1: Revenue Experiments (Post-Launch)

**Potential revenue streams to test:**

1. **Premium PDF Edition**
   - Enhanced design, bonus content
   - One-time purchase ($5-15)
   - Use Gumroad or Lemon Squeezy (instant setup, no build required)

2. **Print-on-Demand**
   - Partner with Lulu or Blurb
   - Margin per book, no inventory
   - No build required

3. **Sponsorship**
   - Edition sponsors (non-invasive)
   - Newsletter sponsors
   - No build required - just sales

### Future: Subscription Model

**Trigger:** Proven demand from first 2-3 editions, 1,000+ email subscribers.

**What to build:**
- Premium tier ($5-10/month or $50-75/year)
- Member-only benefits (early access, bonus essays, community)
- Author revenue share from subscription pool

**Payment platform:** Stripe (industry standard)
- Checkout embeds
- Subscription management
- Author payouts via Stripe Connect

**Author Payout Tracking:**
- Per-essay read counts
- Revenue share calculation (e.g., 20% of subscription revenue split among 20 authors by read share)
- Payout history dashboard

---

## Priority Matrix

### Must Have (Pre-Launch)

| Item | Effort | Impact | Owner |
|------|--------|--------|-------|
| Email service integration | 2-4 hours | Critical | Engineering |
| Basic analytics (Plausible) | 1 hour | High | Engineering |
| Essay page template | 4-8 hours | Critical | Engineering/Design |
| PDF generation workflow | 4-8 hours | Medium | Design |

### Should Have (V1 - 30 Days Post-Launch)

| Item | Effort | Impact |
|------|--------|--------|
| Static site generator migration | 1-2 days | Medium |
| Social sharing buttons | 2-4 hours | Medium |
| Enhanced email sequences | 4-8 hours | Medium |
| Funnel tracking | 2-4 hours | Medium |

### Nice to Have (Future)

| Item | Effort | Impact | Trigger |
|------|--------|--------|---------|
| Author portal | 2-4 weeks | Medium | 50+ submissions/edition |
| Headless CMS | 1-2 weeks | Medium | Non-technical editor |
| Premium tier/payments | 2-4 weeks | High | 1,000+ subscribers |
| Per-essay analytics | 1-2 weeks | Medium | Revenue sharing active |

---

## Build vs. Buy Summary

| Function | Recommendation | Tool |
|----------|----------------|------|
| Email/Newsletter | Buy | Buttondown or ConvertKit |
| Analytics | Buy | Plausible ($9/mo) |
| Submission Tracking | Buy | Airtable or Notion (free) |
| Payment Processing | Buy | Gumroad/Stripe (when needed) |
| Authentication | Buy | Supabase Auth (when needed) |
| Static Site Generator | Build | Astro (free) |
| Essay Pages | Build | Custom templates |
| Author Profiles | Build | Dynamic templates |
| PDF Edition | Build | Design tool + export |

---

## Technical Architecture Recommendation

### MVP Architecture (Current)
```
Static HTML/CSS/JS
      |
  GitHub Pages / Netlify (free)
      |
  Buttondown (email)
      |
  Plausible (analytics)
```

### V1 Architecture (Post-Launch)
```
Astro Static Site Generator
      |
  Markdown Content Files
      |
  Netlify/Vercel (free)
      |
  Buttondown + Airtable + Plausible
```

### Future Architecture (If Needed)
```
Astro/Next.js
      |
  Decap CMS or Sanity (content)
      |
  Supabase (auth + database)
      |
  Stripe (payments)
      |
  Vercel (hosting)
```

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Low email signup conversion | Medium | High | Optimize form placement, A/B test copy |
| Insufficient submissions | Medium | Critical | Expand outreach, lower author count |
| Technical complexity creep | High | Medium | Stick to MVP, resist feature creep |
| Email deliverability issues | Low | High | Use established service, warm up list |
| No payment infrastructure when needed | Low | Medium | Gumroad provides instant solution |

---

## Success Metrics

### Pre-Launch (Now - Q2 2026)
- Email signups: Target 500+ before launch
- Confirmed authors: Target 20 (minimum 5 per contingency plan)
- Site traffic: Baseline established

### Launch (Q2 2026)
- Edition One downloads/reads: 1,000+
- Email open rate: >40%
- Social shares: 100+

### Post-Launch (6 months)
- Email list: 2,000+
- Returning readers for Edition Two: 50% of Edition One readers
- Author referrals: 2+ unsolicited quality submissions/edition

---

## Recommended Next Steps

### Immediate (This Week)
1. **Connect email signup to Buttondown** - Highest priority, blocks all email marketing
2. **Add Plausible analytics** - Start tracking before any traffic push
3. **Finalize submission tracking spreadsheet** - Formalize what exists

### Before Launch
4. **Build essay page template** - Required to publish Edition One
5. **Design and generate PDF** - Alternative reading format
6. **Set up welcome email sequence** - Onboard new subscribers

### Post-Launch Evaluation
7. **Assess if static site generator migration worthwhile** - Based on pain maintaining HTML
8. **Evaluate author portal need** - Based on submission volume and author feedback
9. **Test monetization experiment** - Premium PDF or sponsorship

---

*This document should be revisited after Edition One launch with learnings incorporated.*
