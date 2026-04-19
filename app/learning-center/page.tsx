'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard-header';

type QA = {
  question: string;
  answer: React.ReactNode;
};

const QA_LIST: QA[] = [
  {
    question: 'What is a reserve fund?',
    answer: (
      <>
        <h2 style={{ color: '#102C4A', fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>
          What Is a Reserve Fund?
        </h2>
        <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.7, marginBottom: '16px' }}>
          When you live in a housing society, apartment complex, or HOA, you regularly pay maintenance fees.
          Most people assume this money is only used for daily expenses like cleaning, security, or
          electricity—but that's only part of the story.
        </p>
        <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.7, marginBottom: '32px' }}>
          A reserve fund is a dedicated pool of money set aside for future major repairs and replacements.
          It's not for day-to-day operations. Instead, it acts as a financial safety net for big, unavoidable
          expenses that happen over time.
        </p>
        <div style={{ borderTop: '1px solid #E6E8EC', paddingTop: '24px', marginBottom: '24px' }}>
          <h3 style={{ color: '#102C4A', fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>
            Why a Reserve Fund Exists
          </h3>
          <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.7, marginBottom: '12px' }}>
            Buildings and infrastructure don't last forever. Over the years, things wear out:
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            {['Elevators need replacement', 'Roofs need repair', 'Paint fades and needs refreshing', 'Plumbing and electrical systems age'].map((item) => (
              <li key={item} style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.8 }}>{item}</li>
            ))}
          </ul>
          <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.7 }}>
            These are high-cost, long-term expenses. Without a reserve fund, residents would suddenly be asked
            to pay large one-time amounts—something most people aren't prepared for.
          </p>
        </div>
        <div style={{ borderTop: '1px solid #E6E8EC', paddingTop: '24px' }}>
          <h3 style={{ color: '#102C4A', fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>
            Simple Example
          </h3>
          <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.7, marginBottom: '8px' }}>
            Imagine a society with 120 housing units.<br />
            Each resident pays ₹2,000 per month:
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '12px' }}>
            <li style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.8 }}>₹1,200 goes toward daily expenses (maintenance, staff, utilities)</li>
            <li style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.8 }}>₹800 goes into the reserve fund</li>
          </ul>
          <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.7, marginBottom: '8px' }}>
            Over time, this fund grows. Let's say after a few years, it reaches ₹50 lakh.<br />
            Now, when:
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '12px' }}>
            <li style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.8 }}>the lift needs replacement (₹20 lakh)</li>
            <li style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.8 }}>or the building needs repainting (₹15 lakh)</li>
          </ul>
          <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.7 }}>
            The society can use the reserve fund instead of asking each resident to suddenly contribute a large amount.
          </p>
        </div>
      </>
    ),
  },
  {
    question: 'Why is a reserve fund important for long-term planning?',
    answer: (
      <>
        <h2 style={{ color: '#102C4A', fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>
          Why Is a Reserve Fund Important for Long-Term Planning?
        </h2>
        <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.7, marginBottom: '16px' }}>
          A reserve fund is essential because it allows communities to plan ahead and avoid financial crises.
          Instead of scrambling for money when an emergency repair is needed, a well-funded reserve ensures
          money is already available.
        </p>
        <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.7, marginBottom: '24px' }}>
          Long-term planning with reserve funds helps stabilize monthly fees for residents, maintains property
          values, and ensures that the community can meet its obligations without special assessments or loans.
        </p>
        <div style={{ borderTop: '1px solid #E6E8EC', paddingTop: '24px' }}>
          <h3 style={{ color: '#102C4A', fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>
            Key Benefits
          </h3>
          <ul style={{ paddingLeft: '20px' }}>
            {[
              'Predictable costs for homeowners and associations',
              'Avoids emergency special assessments',
              'Maintains and improves property values',
              'Ensures compliance with local regulations',
              'Builds financial credibility with lenders and insurers',
            ].map((item) => (
              <li key={item} style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.8 }}>{item}</li>
            ))}
          </ul>
        </div>
      </>
    ),
  },
  {
    question: 'What is a reserve fund study?',
    answer: (
      <>
        <h2 style={{ color: '#102C4A', fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>
          What Is a Reserve Fund Study?
        </h2>
        <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.7, marginBottom: '16px' }}>
          A reserve fund study is a detailed financial and physical analysis of a community's common property
          components. It evaluates what needs to be repaired or replaced, when it will need attention, and
          how much it will cost.
        </p>
        <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.7, marginBottom: '24px' }}>
          The study results in a funding plan that tells the association how much money should be set aside
          each year to meet future repair and replacement needs without financial strain.
        </p>
        <div style={{ borderTop: '1px solid #E6E8EC', paddingTop: '24px' }}>
          <h3 style={{ color: '#102C4A', fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>
            What a Study Includes
          </h3>
          <ul style={{ paddingLeft: '20px' }}>
            {[
              'Physical inspection of common area components',
              'Estimated remaining useful life of each component',
              'Projected replacement or repair costs',
              'Current reserve fund balance analysis',
              'Recommended annual contribution amounts',
            ].map((item) => (
              <li key={item} style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.8 }}>{item}</li>
            ))}
          </ul>
        </div>
      </>
    ),
  },
  {
    question: 'How often should a reserve study be updated?',
    answer: (
      <>
        <h2 style={{ color: '#102C4A', fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>
          How Often Should a Reserve Study Be Updated?
        </h2>
        <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.7, marginBottom: '16px' }}>
          Reserve studies should be updated regularly to reflect changes in costs, the condition of
          components, and the current fund balance. Most industry experts and many state laws recommend
          updating a reserve study every 1 to 3 years.
        </p>
        <div style={{ borderTop: '1px solid #E6E8EC', paddingTop: '24px' }}>
          <h3 style={{ color: '#102C4A', fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>
            Types of Updates
          </h3>
          <ul style={{ paddingLeft: '20px' }}>
            {[
              'Full study: Complete physical inspection and financial analysis (every 3-5 years)',
              'Update with site visit: Physical inspection of components with updated financials',
              'Update without site visit: Financial update only, using prior inspection data',
            ].map((item) => (
              <li key={item} style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.8 }}>{item}</li>
            ))}
          </ul>
        </div>
      </>
    ),
  },
  {
    question: 'What is included in a reserve fund study?',
    answer: (
      <>
        <h2 style={{ color: '#102C4A', fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>
          What Is Included in a Reserve Fund Study?
        </h2>
        <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.7, marginBottom: '16px' }}>
          A comprehensive reserve fund study includes both a physical analysis and a financial analysis of
          the community's common area assets.
        </p>
        <div style={{ borderTop: '1px solid #E6E8EC', paddingTop: '24px', marginBottom: '24px' }}>
          <h3 style={{ color: '#102C4A', fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>
            Physical Analysis
          </h3>
          <ul style={{ paddingLeft: '20px' }}>
            {['Identification of all reservable components', 'Current condition assessment', 'Estimated useful life and remaining life', 'Projected replacement cost'].map((item) => (
              <li key={item} style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.8 }}>{item}</li>
            ))}
          </ul>
        </div>
        <div style={{ borderTop: '1px solid #E6E8EC', paddingTop: '24px' }}>
          <h3 style={{ color: '#102C4A', fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>
            Financial Analysis
          </h3>
          <ul style={{ paddingLeft: '20px' }}>
            {['Current reserve fund balance', 'Projected income from contributions', 'Projected expenditures over 20-30 years', 'Recommended funding plan'].map((item) => (
              <li key={item} style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.8 }}>{item}</li>
            ))}
          </ul>
        </div>
      </>
    ),
  },
  {
    question: 'How is the reserve fund calculated?',
    answer: (
      <>
        <h2 style={{ color: '#102C4A', fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>
          How Is the Reserve Fund Calculated?
        </h2>
        <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.7, marginBottom: '16px' }}>
          The reserve fund is calculated using the percent funded method or the threshold method, taking
          into account the current fund balance, projected future expenditures, expected investment returns,
          and inflation rates.
        </p>
        <div style={{ borderTop: '1px solid #E6E8EC', paddingTop: '24px' }}>
          <h3 style={{ color: '#102C4A', fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>
            Key Formula Elements
          </h3>
          <ul style={{ paddingLeft: '20px' }}>
            {['Beginning reserve balance', 'Annual contributions from assessments', 'Interest/investment earnings', 'Projected expenditures each year', 'Inflation adjustments on future costs'].map((item) => (
              <li key={item} style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.8 }}>{item}</li>
            ))}
          </ul>
        </div>
      </>
    ),
  },
  {
    question: 'What is the difference between a reserve fund and an operating fund?',
    answer: (
      <>
        <h2 style={{ color: '#102C4A', fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>
          What Is the Difference Between a Reserve Fund and an Operating Fund?
        </h2>
        <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.7, marginBottom: '24px' }}>
          These two funds serve very different purposes and should always be kept separate.
        </p>
        <div style={{ borderTop: '1px solid #E6E8EC', paddingTop: '24px', marginBottom: '24px' }}>
          <h3 style={{ color: '#102C4A', fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>
            Operating Fund
          </h3>
          <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.7 }}>
            Covers day-to-day expenses: utilities, landscaping, management fees, insurance premiums,
            and routine maintenance. These are recurring, predictable monthly costs.
          </p>
        </div>
        <div style={{ borderTop: '1px solid #E6E8EC', paddingTop: '24px' }}>
          <h3 style={{ color: '#102C4A', fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>
            Reserve Fund
          </h3>
          <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.7 }}>
            Covers long-term capital expenditures: roof replacement, elevator overhaul, parking lot
            resurfacing, and other major repairs. These are infrequent, high-cost projects.
          </p>
        </div>
      </>
    ),
  },
  {
    question: 'How much money should be in a reserve fund?',
    answer: (
      <>
        <h2 style={{ color: '#102C4A', fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>
          How Much Money Should Be in a Reserve Fund?
        </h2>
        <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.7, marginBottom: '16px' }}>
          The ideal reserve fund balance depends on the age, size, and condition of the community's
          components. A healthy reserve fund is typically considered to be at least 70% funded, meaning
          the balance on hand is at least 70% of what it theoretically should be.
        </p>
        <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.7 }}>
          A reserve study will calculate the exact recommended balance for your specific community based
          on projected expenses over the next 20–30 years.
        </p>
      </>
    ),
  },
  {
    question: 'Who manages the reserve fund?',
    answer: (
      <>
        <h2 style={{ color: '#102C4A', fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>
          Who Manages the Reserve Fund?
        </h2>
        <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.7, marginBottom: '16px' }}>
          The reserve fund is typically managed by the board of directors of the homeowners association
          (HOA) or community association. They are responsible for ensuring contributions are collected,
          the fund is invested appropriately, and expenditures are approved and documented.
        </p>
        <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.7 }}>
          Many associations hire professional property managers to assist with day-to-day administration
          of the reserve fund.
        </p>
      </>
    ),
  },
  {
    question: 'What happens if the reserve fund is underfunded?',
    answer: (
      <>
        <h2 style={{ color: '#102C4A', fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>
          What Happens If the Reserve Fund Is Underfunded?
        </h2>
        <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.7, marginBottom: '16px' }}>
          An underfunded reserve fund puts the entire community at financial risk. When major repairs
          become necessary and there isn't enough money saved, the association is faced with difficult choices.
        </p>
        <div style={{ borderTop: '1px solid #E6E8EC', paddingTop: '24px' }}>
          <h3 style={{ color: '#102C4A', fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>
            Possible Consequences
          </h3>
          <ul style={{ paddingLeft: '20px' }}>
            {[
              'Special assessments — large one-time charges to homeowners',
              'Borrowing — the association must take out loans at interest',
              'Deferred maintenance — repairs are postponed, worsening the problem',
              'Reduced property values — lenders may refuse to finance units in underfunded communities',
              'Legal liability — if safety-related repairs are neglected',
            ].map((item) => (
              <li key={item} style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.8 }}>{item}</li>
            ))}
          </ul>
        </div>
      </>
    ),
  },
  {
    question: 'How are reserve fund contributions determined?',
    answer: (
      <>
        <h2 style={{ color: '#102C4A', fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>
          How Are Reserve Fund Contributions Determined?
        </h2>
        <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.7, marginBottom: '16px' }}>
          Contributions are determined through the reserve study funding plan. The study calculates the
          annual amount needed so that sufficient funds will be available when each component reaches the
          end of its useful life.
        </p>
        <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.7 }}>
          Contributions are typically collected as part of the monthly HOA or maintenance fee. Each
          homeowner contributes a proportional share based on their unit ownership percentage.
        </p>
      </>
    ),
  },
  {
    question: 'Can reserve funds be used for emergency expenses?',
    answer: (
      <>
        <h2 style={{ color: '#102C4A', fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>
          Can Reserve Funds Be Used for Emergency Expenses?
        </h2>
        <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.7, marginBottom: '16px' }}>
          Reserve funds are generally intended for planned capital expenditures, not day-to-day
          emergencies. However, in cases of unexpected major repairs that could not be anticipated
          (such as storm damage or sudden structural failure), boards may use reserve funds as a last resort.
        </p>
        <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.7 }}>
          Many states require board approval and proper documentation when reserve funds are used for
          unplanned expenditures. The funds should be replenished as soon as possible.
        </p>
      </>
    ),
  },
  {
    question: 'What types of assets are covered in a reserve study?',
    answer: (
      <>
        <h2 style={{ color: '#102C4A', fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>
          What Types of Assets Are Covered in a Reserve Study?
        </h2>
        <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.7, marginBottom: '16px' }}>
          A reserve study covers common area components that the association is responsible for maintaining.
          These typically include significant assets with a useful life of more than one year and a
          replacement cost above a minimum threshold.
        </p>
        <div style={{ borderTop: '1px solid #E6E8EC', paddingTop: '24px' }}>
          <h3 style={{ color: '#102C4A', fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>
            Common Examples
          </h3>
          <ul style={{ paddingLeft: '20px' }}>
            {['Roofing systems', 'Elevators and escalators', 'HVAC systems', 'Parking lots and driveways', 'Swimming pools and recreational facilities', 'Exterior painting', 'Plumbing and electrical systems', 'Fencing and gates'].map((item) => (
              <li key={item} style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.8 }}>{item}</li>
            ))}
          </ul>
        </div>
      </>
    ),
  },
  {
    question: 'How does a reserve study help with budgeting?',
    answer: (
      <>
        <h2 style={{ color: '#102C4A', fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>
          How Does a Reserve Study Help With Budgeting?
        </h2>
        <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.7, marginBottom: '16px' }}>
          A reserve study provides a 20–30 year projection of all expected major expenditures. This allows
          the board to plan annual budgets with confidence, knowing exactly how much needs to be contributed
          to the reserve each year.
        </p>
        <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.7 }}>
          With this data, associations can set assessment amounts that avoid sudden large increases,
          and demonstrate financial responsibility to homeowners and lenders.
        </p>
      </>
    ),
  },
  {
    question: 'What is a reserve fund forecast?',
    answer: (
      <>
        <h2 style={{ color: '#102C4A', fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>
          What Is a Reserve Fund Forecast?
        </h2>
        <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.7, marginBottom: '16px' }}>
          A reserve fund forecast is a multi-year projection showing the expected inflows (contributions
          and interest) and outflows (repair and replacement expenditures) of the reserve fund over time.
        </p>
        <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.7 }}>
          It helps associations visualize whether their current funding level is adequate or if adjustments
          are needed to avoid running out of money in future years.
        </p>
      </>
    ),
  },
  {
    question: 'How do inflation and market changes affect reserve funds?',
    answer: (
      <>
        <h2 style={{ color: '#102C4A', fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>
          How Do Inflation and Market Changes Affect Reserve Funds?
        </h2>
        <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.7, marginBottom: '16px' }}>
          Inflation increases the future cost of repairs and replacements. A roof that costs ₹10 lakh today
          may cost ₹14–16 lakh in ten years. Reserve studies account for inflation by applying annual cost
          escalation rates to projected future expenses.
        </p>
        <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.7 }}>
          Similarly, the interest rate earned on invested reserve funds affects how quickly the fund grows.
          Regular updates to the reserve study ensure these assumptions remain accurate.
        </p>
      </>
    ),
  },
  {
    question: 'Can reserve funds reduce unexpected costs?',
    answer: (
      <>
        <h2 style={{ color: '#102C4A', fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>
          Can Reserve Funds Reduce Unexpected Costs?
        </h2>
        <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.7, marginBottom: '16px' }}>
          Yes — one of the primary purposes of a reserve fund is to convert "unexpected" costs into
          planned, predictable ones. By identifying all major future expenses in advance through a
          reserve study, communities can prepare financially rather than react in crisis.
        </p>
        <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.7 }}>
          A well-funded reserve also provides a buffer for costs that exceed estimates, reducing the
          likelihood of special assessments even when actual costs are higher than projected.
        </p>
      </>
    ),
  },
  {
    question: 'What are the risks of not having a reserve fund?',
    answer: (
      <>
        <h2 style={{ color: '#102C4A', fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>
          What Are the Risks of Not Having a Reserve Fund?
        </h2>
        <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.7, marginBottom: '16px' }}>
          Operating without a reserve fund exposes the community to serious financial and legal risks.
        </p>
        <div style={{ borderTop: '1px solid #E6E8EC', paddingTop: '24px' }}>
          <ul style={{ paddingLeft: '20px' }}>
            {[
              'Sudden large special assessments that homeowners cannot afford',
              'Inability to obtain loans due to poor financial standing',
              'Deferred maintenance leading to accelerated deterioration',
              'Reduced property values and difficulty selling units',
              'Legal disputes and liability if safety repairs are delayed',
              'Regulatory penalties in jurisdictions requiring reserve funding',
            ].map((item) => (
              <li key={item} style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.8 }}>{item}</li>
            ))}
          </ul>
        </div>
      </>
    ),
  },
];

export default function LearningCenterPage() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [query, setQuery] = useState('');

  const filtered = QA_LIST.filter((qa) =>
    qa.question.toLowerCase().includes(query.toLowerCase()),
  );

  const selected = QA_LIST[selectedIdx];

  return (
    <div className="min-h-screen" style={{ background: '#F6F7F9', paddingTop: '64px' }}>
      <DashboardHeader />

      <div className="mx-auto" style={{ maxWidth: '1242px', padding: '32px 24px 48px' }}>
        <h1 style={{ color: '#102C4A', fontSize: '24px', fontWeight: 600, margin: '0 0 24px' }}>
          Learning Center
        </h1>

        <div
          className="bg-white"
          style={{
            border: '1px solid #D7D7D7',
            borderRadius: '10px',
            display: 'grid',
            gridTemplateColumns: '340px 1fr',
            overflow: 'hidden',
            minHeight: '780px',
          }}
        >
          {/* Left: question list */}
          <aside style={{ borderRight: '1px solid #D7D7D7' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F2F4' }}>
              <div style={{ position: 'relative' }}>
                <Search
                  className="w-4 h-4"
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#66717D',
                  }}
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Find Question"
                  style={{
                    width: '100%',
                    height: '40px',
                    borderRadius: '7px',
                    border: '1px solid #D7D7D7',
                    background: '#FFFFFF',
                    paddingLeft: '36px',
                    paddingRight: '12px',
                    fontSize: '14px',
                    color: '#102C4A',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
            </div>

            <div style={{ overflowY: 'auto', maxHeight: 'calc(780px - 73px)' }}>
              {filtered.length === 0 ? (
                <div style={{ padding: '20px', color: '#66717D', fontSize: '14px' }}>
                  No questions found.
                </div>
              ) : (
                filtered.map((qa) => {
                  const originalIdx = QA_LIST.indexOf(qa);
                  const isActive = originalIdx === selectedIdx;
                  return (
                    <button
                      key={qa.question}
                      type="button"
                      onClick={() => setSelectedIdx(originalIdx)}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        width: '100%',
                        textAlign: 'left',
                        padding: '14px 20px',
                        borderBottom: '1px solid #F1F2F4',
                        background: isActive ? '#F1F4F9' : '#FFFFFF',
                        cursor: 'pointer',
                        border: 'none',
                        borderLeft: isActive ? '3px solid #0E519B' : '3px solid transparent',
                      }}
                    >
                      <span
                        style={{
                          flexShrink: 0,
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#102C4A',
                          marginTop: '7px',
                        }}
                      />
                      <span
                        style={{
                          color: isActive ? '#0E519B' : '#102C4A',
                          fontSize: '14px',
                          lineHeight: 1.5,
                          fontWeight: isActive ? 500 : 400,
                          textDecoration: isActive ? 'underline' : 'none',
                        }}
                      >
                        {qa.question}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          {/* Right: answer content */}
          <section
            style={{
              padding: '32px 40px',
              overflowY: 'auto',
              maxHeight: '780px',
            }}
          >
            {selected?.answer}
          </section>
        </div>
      </div>
    </div>
  );
}
