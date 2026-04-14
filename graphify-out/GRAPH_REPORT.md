# Graph Report - .  (2026-04-14)

## Corpus Check
- 81 files · ~60,847 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 215 nodes · 182 edges · 62 communities detected
- Extraction: 80% EXTRACTED · 19% INFERRED · 1% AMBIGUOUS · INFERRED: 35 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_App Router Pages|App Router Pages]]
- [[_COMMUNITY_Master Page Layout|Master Page Layout]]
- [[_COMMUNITY_Company Type Selection|Company Type Selection]]
- [[_COMMUNITY_Design System (CLAUDE.md)|Design System (CLAUDE.md)]]
- [[_COMMUNITY_Design Tokens (ColorsType)|Design Tokens (Colors/Type)]]
- [[_COMMUNITY_Reserve Fund Domain|Reserve Fund Domain]]
- [[_COMMUNITY_OTP Page Logic|OTP Page Logic]]
- [[_COMMUNITY_Next.js Bootstrap|Next.js Bootstrap]]
- [[_COMMUNITY_Upload Logo Modal|Upload Logo Modal]]
- [[_COMMUNITY_shadcn Select Component|shadcn Select Component]]
- [[_COMMUNITY_Posts Page|Posts Page]]
- [[_COMMUNITY_Posts API Route|Posts API Route]]
- [[_COMMUNITY_Upload Reserve Study Modal|Upload Reserve Study Modal]]
- [[_COMMUNITY_Prisma Client Internals|Prisma Client Internals]]
- [[_COMMUNITY_Auth Layout Visuals|Auth Layout Visuals]]
- [[_COMMUNITY_MeetingTeam Icons|Meeting/Team Icons]]
- [[_COMMUNITY_Finance Illustrations|Finance Illustrations]]
- [[_COMMUNITY_Root Layout|Root Layout]]
- [[_COMMUNITY_Login Page|Login Page]]
- [[_COMMUNITY_shadcn Label|shadcn Label]]
- [[_COMMUNITY_Phone Input|Phone Input]]
- [[_COMMUNITY_Button + cn()|Button + cn()]]
- [[_COMMUNITY_Checkbox|Checkbox]]
- [[_COMMUNITY_Textarea|Textarea]]
- [[_COMMUNITY_Input|Input]]
- [[_COMMUNITY_Utils (cn)|Utils (cn)]]
- [[_COMMUNITY_Dashboard Preview|Dashboard Preview]]
- [[_COMMUNITY_Navigation Icons|Navigation Icons]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]

## God Nodes (most connected - your core abstractions)
1. `Style Guide Image (Tokens & Type Scale)` - 14 edges
2. `Signup Screen (Company Profile)` - 13 edges
3. `Design System Overview` - 9 edges
4. `Company Type Selection Grid (2 rows x 3 cols)` - 9 edges
5. `Signup - Create Company Profile Screen` - 8 edges
6. `Light Mode Color Palette` - 6 edges
7. `Right Content Panel (form area)` - 6 edges
8. `markTouched()` - 5 edges
9. `Next.js Project (Reserve Fund)` - 5 edges
10. `Project Design System (CLAUDE.md)` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Reserve Study Company Option` --semantically_similar_to--> `Reserve Fund Study`  [INFERRED] [semantically similar]
  public/screen/Signup.pdf → graphify-out/transcripts/movie.txt
- `Link Color #0E519B` --semantically_similar_to--> `Link inherits from parent`  [AMBIGUOUS] [semantically similar]
  DESIGN_SYSTEM.md → CLAUDE.md
- `Project Design System (CLAUDE.md)` --semantically_similar_to--> `Design System Overview`  [INFERRED] [semantically similar]
  CLAUDE.md → DESIGN_SYSTEM.md
- `Signup Screen (Company Profile)` --implements--> `Master Page Layout`  [INFERRED]
  public/screen/Signup.pdf → CLAUDE.md
- `Reserve Fund Advisers LLC Brand` --implements--> `Left Panel 353px (leftbg.png/logo.png)`  [INFERRED]
  public/screen/Signup.pdf → CLAUDE.md

## Hyperedges (group relationships)
- **Reserve Fund design system applied to Signup screen** — designsystem_overview, claudemd_design_system, signup_screen [INFERRED 0.80]
- **Reserve Fund product/brand identity** — movie_reserve_fund_study, signup_company_type_reserve_study, signup_brand_reserve_fund_advisers [INFERRED 0.85]
- **Left auth panel visual composition (background + logo)** — leftbg_image, logo_image [INFERRED 0.85]
- **Company Type Card Group** — card_management_company, card_bank_office, card_reserve_study_company, card_investor_advisor, card_board_members, card_other [EXTRACTED 1.00]
- **Footer Region Group** — footer_contact_email, footer_contact_phone, footer_privacy_policy, footer_copyright [EXTRACTED 1.00]
- **Color Token Set** — styleguide_color_text_default, styleguide_color_link, styleguide_color_secondary_text, styleguide_color_border, styleguide_color_form_outline, styleguide_color_selected_field_border [INFERRED 0.90]
- **Typography Scale** — styleguide_type_h1, styleguide_type_h2, styleguide_type_h3, styleguide_type_body, styleguide_type_secondary, styleguide_type_indicator, styleguide_font_family_google_sans [INFERRED 0.90]

## Communities

### Community 0 - "App Router Pages"
Cohesion: 0.11
Nodes (8): closeIntro(), closeInvite(), goNext(), handleConfirm(), handleContinue(), handleSkip(), markTouched(), openInviteFromIntro()

### Community 1 - "Master Page Layout"
Cohesion: 0.09
Nodes (23): public/images/ assets path, Left Panel 353px (leftbg.png/logo.png), Master Page Layout, app/register/page.tsx (Reference), Right Panel (centered 643px card), Avoid Special Assessments, Long-term Financial Strategy, Physical Property Inspection (+15 more)

### Community 2 - "Company Type Selection"
Cohesion: 0.1
Nodes (22): Card: Bank Office, Card: Board Members, Card: Investor Advisor, Card: Management Company, Card: Other, Card: Reserve Study Company (selected, blue border + check badge), Company Type Selection Grid (2 rows x 3 cols), Primary CTA Button: Continue (blue) (+14 more)

### Community 3 - "Design System (CLAUDE.md)"
Cohesion: 0.12
Nodes (19): Border #D7D7D7 (CLAUDE.md), Project Design System (CLAUDE.md), Link inherits from parent, shadcn/ui Forms Mandate, Border Color #B5BCC4, Dark Mode Color Palette, Light Mode Color Palette, Corner Radius 7px (+11 more)

### Community 4 - "Design Tokens (Colors/Type)"
Cohesion: 0.19
Nodes (15): Border Colour #B5BCC4, Form Outline #B5BCC4, Link Colour #0E519B, Secondary Text Colour #66717D, Selected Field Border #0E519B, Text Default Colour #102C4A, Corner Radius 7PX, Font Family: Google Sans (+7 more)

### Community 5 - "Reserve Fund Domain"
Cohesion: 0.22
Nodes (9): Banking, Business Meeting, Financial Advisor, Inflation, Reserve Fund Domain, Line-art icon: smiling female professional in suit with glowing lightbulb idea and growth chart, representing a financial advisor, Line-art icon: three business people in suits standing in front of office skyscrapers, representing a corporate business team or meeting, Line-art icon: stack of coins with dollar coin and ascending bar chart with upward arrow, representing rising prices/inflation (+1 more)

### Community 6 - "OTP Page Logic"
Cohesion: 0.32
Nodes (3): handleChange(), handleKeyDown(), setDigitAt()

### Community 7 - "Next.js Bootstrap"
Cohesion: 0.29
Nodes (7): Next.js Breaking Changes Notice, Read node_modules/next/dist/docs/, create-next-app bootstrap, Dev Server (npm/yarn/pnpm/bun), Geist Font (next/font), Next.js Project (Reserve Fund), Vercel Deployment

### Community 8 - "Upload Logo Modal"
Cohesion: 0.47
Nodes (3): handleApply(), handleClose(), reset()

### Community 9 - "shadcn Select Component"
Cohesion: 0.33
Nodes (0): 

### Community 10 - "Posts Page"
Cohesion: 1.0
Nodes (2): fetchPosts(), handleSubmit()

### Community 11 - "Posts API Route"
Cohesion: 0.67
Nodes (0): 

### Community 12 - "Upload Reserve Study Modal"
Cohesion: 1.0
Nodes (2): handleClose(), handleSubmit()

### Community 13 - "Prisma Client Internals"
Cohesion: 0.67
Nodes (0): 

### Community 14 - "Auth Layout Visuals"
Cohesion: 0.67
Nodes (3): Auth/Registration Master Layout, Deep blue gradient background for the fixed left auth/registration panel (353px column), Reservefund primary wordmark/logo (white, used on dark left panel)

### Community 15 - "Meeting/Team Icons"
Cohesion: 1.0
Nodes (3): Line icon: three people seated at a conference table with two speech bubbles overhead — depicts a team meeting or collaborative discussion in a coworking setting; mood: collaborative, professional, Line icon: three business people standing in front of a government/corporate building connected by lines — depicts an organizational team, board, or institutional collaboration; mood: formal, structured, Line icon (source/master): three people seated at a conference table with two speech bubbles above — meeting/discussion scene; same composition as coworking 1

### Community 16 - "Finance Illustrations"
Cohesion: 1.0
Nodes (3): Line icon: a businesswoman beside a rising bar chart and a lightbulb — symbolizing professional insight, business growth, and ideas; mood: optimistic, analytical, Line icon: a teller/clerk at a counter with a dollar sign — depicts a bank teller, cashier, or finance service desk; mood: transactional, professional, Line icon: a dollar coin alongside a rising bar chart with an upward arrow — symbolizing financial growth, investment returns, or revenue increase; mood: positive, financial

### Community 17 - "Root Layout"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "Login Page"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "shadcn Label"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Phone Input"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "Button + cn()"
Cohesion: 1.0
Nodes (0): 

### Community 22 - "Checkbox"
Cohesion: 1.0
Nodes (0): 

### Community 23 - "Textarea"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "Input"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "Utils (cn)"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "Dashboard Preview"
Cohesion: 1.0
Nodes (2): Reserve Fund Dashboard Preview, Dashboard thumbnail screenshot showing Investment Strategy bar chart with Reserve vs Investment priorities

### Community 27 - "Navigation Icons"
Cohesion: 1.0
Nodes (2): Navigation UI Iconography, Right-pointing chevron arrow icon (next/forward navigation)

### Community 28 - "Community 28"
Cohesion: 1.0
Nodes (0): 

### Community 29 - "Community 29"
Cohesion: 1.0
Nodes (0): 

### Community 30 - "Community 30"
Cohesion: 1.0
Nodes (0): 

### Community 31 - "Community 31"
Cohesion: 1.0
Nodes (0): 

### Community 32 - "Community 32"
Cohesion: 1.0
Nodes (0): 

### Community 33 - "Community 33"
Cohesion: 1.0
Nodes (0): 

### Community 34 - "Community 34"
Cohesion: 1.0
Nodes (0): 

### Community 35 - "Community 35"
Cohesion: 1.0
Nodes (0): 

### Community 36 - "Community 36"
Cohesion: 1.0
Nodes (0): 

### Community 37 - "Community 37"
Cohesion: 1.0
Nodes (0): 

### Community 38 - "Community 38"
Cohesion: 1.0
Nodes (0): 

### Community 39 - "Community 39"
Cohesion: 1.0
Nodes (0): 

### Community 40 - "Community 40"
Cohesion: 1.0
Nodes (0): 

### Community 41 - "Community 41"
Cohesion: 1.0
Nodes (0): 

### Community 42 - "Community 42"
Cohesion: 1.0
Nodes (0): 

### Community 43 - "Community 43"
Cohesion: 1.0
Nodes (0): 

### Community 44 - "Community 44"
Cohesion: 1.0
Nodes (0): 

### Community 45 - "Community 45"
Cohesion: 1.0
Nodes (0): 

### Community 46 - "Community 46"
Cohesion: 1.0
Nodes (0): 

### Community 47 - "Community 47"
Cohesion: 1.0
Nodes (0): 

### Community 48 - "Community 48"
Cohesion: 1.0
Nodes (0): 

### Community 49 - "Community 49"
Cohesion: 1.0
Nodes (0): 

### Community 50 - "Community 50"
Cohesion: 1.0
Nodes (0): 

### Community 51 - "Community 51"
Cohesion: 1.0
Nodes (0): 

### Community 52 - "Community 52"
Cohesion: 1.0
Nodes (0): 

### Community 53 - "Community 53"
Cohesion: 1.0
Nodes (1): file icon

### Community 54 - "Community 54"
Cohesion: 1.0
Nodes (1): vercel icon

### Community 55 - "Community 55"
Cohesion: 1.0
Nodes (1): next icon

### Community 56 - "Community 56"
Cohesion: 1.0
Nodes (1): globe icon

### Community 57 - "Community 57"
Cohesion: 1.0
Nodes (1): window icon

### Community 58 - "Community 58"
Cohesion: 1.0
Nodes (1): other icon

### Community 59 - "Community 59"
Cohesion: 1.0
Nodes (1): Reservefund compact logo mark (small white/transparent)

### Community 60 - "Community 60"
Cohesion: 1.0
Nodes (1): Colorful abstract swirl graphic (likely decorative type/illustration accent)

### Community 61 - "Community 61"
Cohesion: 1.0
Nodes (1): Blank/empty elliptical placeholder shape (Figma-exported Ellipse 353)

## Ambiguous Edges - Review These
- `Link Color #0E519B` → `Link inherits from parent`  [AMBIGUOUS]
  DESIGN_SYSTEM.md · relation: semantically_similar_to
- `Border Color #B5BCC4` → `Border #D7D7D7 (CLAUDE.md)`  [AMBIGUOUS]
  CLAUDE.md · relation: conceptually_related_to

## Knowledge Gaps
- **68 isolated node(s):** `create-next-app bootstrap`, `Dev Server (npm/yarn/pnpm/bun)`, `Geist Font (next/font)`, `Vercel Deployment`, `Dark Mode Color Palette` (+63 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Root Layout`** (2 nodes): `layout.tsx`, `RootLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Login Page`** (2 nodes): `page.tsx`, `handleLogin()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `shadcn Label`** (2 nodes): `label.tsx`, `Label()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Phone Input`** (2 nodes): `phone-input.tsx`, `PhoneInput()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Button + cn()`** (2 nodes): `cn()`, `button.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Checkbox`** (2 nodes): `Checkbox()`, `checkbox.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Textarea`** (2 nodes): `textarea.tsx`, `cn()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Input`** (2 nodes): `input.tsx`, `Input()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Utils (cn)`** (2 nodes): `utils.ts`, `cn()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Dashboard Preview`** (2 nodes): `Reserve Fund Dashboard Preview`, `Dashboard thumbnail screenshot showing Investment Strategy bar chart with Reserve vs Investment priorities`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Navigation Icons`** (2 nodes): `Navigation UI Iconography`, `Right-pointing chevron arrow icon (next/forward navigation)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (1 nodes): `prisma.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 30`** (1 nodes): `next.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 32`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 33`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 34`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 35`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 36`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 38`** (1 nodes): `tab-switcher.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 39`** (1 nodes): `association-detail.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 40`** (1 nodes): `dashboard-header.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 41`** (1 nodes): `page-footer.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 42`** (1 nodes): `left-panel.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 43`** (1 nodes): `prisma.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 44`** (1 nodes): `browser.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 45`** (1 nodes): `client.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 46`** (1 nodes): `index.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 47`** (1 nodes): `models.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 48`** (1 nodes): `commonInputTypes.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 49`** (1 nodes): `enums.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 50`** (1 nodes): `prismaNamespace.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 51`** (1 nodes): `prismaNamespaceBrowser.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 52`** (1 nodes): `Post.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 53`** (1 nodes): `file icon`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 54`** (1 nodes): `vercel icon`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 55`** (1 nodes): `next icon`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 56`** (1 nodes): `globe icon`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 57`** (1 nodes): `window icon`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 58`** (1 nodes): `other icon`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 59`** (1 nodes): `Reservefund compact logo mark (small white/transparent)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 60`** (1 nodes): `Colorful abstract swirl graphic (likely decorative type/illustration accent)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 61`** (1 nodes): `Blank/empty elliptical placeholder shape (Figma-exported Ellipse 353)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Link Color #0E519B` and `Link inherits from parent`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **What is the exact relationship between `Border Color #B5BCC4` and `Border #D7D7D7 (CLAUDE.md)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `Master Page Layout` connect `Master Page Layout` to `Design System (CLAUDE.md)`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `Project Design System (CLAUDE.md)` connect `Design System (CLAUDE.md)` to `Master Page Layout`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Company Type Selection Grid (2 rows x 3 cols)` (e.g. with `Design Token: Card border radius (~7px)` and `Rationale: Visual icon grid lets users self-identify role quickly with single-select pattern`) actually correct?**
  _`Company Type Selection Grid (2 rows x 3 cols)` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `Signup - Create Company Profile Screen` (e.g. with `Link: 'I already have an account'` and `Rationale: Two-panel master layout reinforces brand while focusing on form`) actually correct?**
  _`Signup - Create Company Profile Screen` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `create-next-app bootstrap`, `Dev Server (npm/yarn/pnpm/bun)`, `Geist Font (next/font)` to the rest of the system?**
  _68 weakly-connected nodes found - possible documentation gaps or missing edges._