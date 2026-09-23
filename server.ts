import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Lazy Gemini Client
  let aiClient: GoogleGenAI | null = null;
  function getGenAI(): GoogleGenAI | null {
    if (!aiClient && process.env.GEMINI_API_KEY) {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return aiClient;
  }

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Daily Rotating Tax-Saving Tips API
  app.get('/api/tax-saving-tips', async (req, res) => {
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);

    const fallbackTips = [
      {
        id: 'tip-1',
        title: 'Section 80CCD(1B): The ₹50,000 NPS Extra Deduction',
        category: 'Retirement & NPS',
        savings: 'Save up to ₹15,600 in 30% slab',
        summary: 'Invest up to ₹50,000 exclusively in the National Pension System (Tier-1) over and above the ₹1.5 Lakh limit of Section 80C.',
        action: 'Open an e-NPS account with PRAN and contribute ₹50,000 before March 31st to claim the dedicated deduction in ITR.',
        applicableRegime: 'Old Tax Regime',
        urgency: 'High Impact'
      },
      {
        id: 'tip-2',
        title: 'New Tax Regime (u/s 115BAC): Zero Tax up to ₹7.75 Lakhs',
        category: 'Regime Optimization',
        savings: 'Zero Tax Liability',
        summary: 'With the enhanced ₹75,000 Standard Deduction and Section 87A rebate, salaried individuals with gross income up to ₹7,75,000 pay zero income tax.',
        action: 'Calculate whether your itemized deductions exceed ₹3.75 Lakhs; if not, opting for the New Tax Regime provides the highest take-home pay with zero paperwork.',
        applicableRegime: 'New Tax Regime',
        urgency: 'General'
      },
      {
        id: 'tip-3',
        title: 'Section 80D: Health Insurance for Self & Senior Parents',
        category: 'Medical & Healthcare',
        savings: 'Save up to ₹23,400 in 30% slab',
        summary: 'Deduct up to ₹25,000 for self/family and an additional ₹50,000 for senior citizen parents (aged 60+), plus ₹5,000 preventive health check-ups.',
        action: 'Ensure health insurance premiums are paid via banking channels (UPI/Net Banking/Card, not cash) to preserve tax eligibility.',
        applicableRegime: 'Old Tax Regime',
        urgency: 'Medium'
      },
      {
        id: 'tip-4',
        title: 'Tax-Loss Harvesting & ₹1.25 Lakh LTCG Exemption',
        category: 'Capital Gains & Equities',
        savings: 'Save up to ₹15,625 on equity gains',
        summary: 'Long-term capital gains on listed equities and equity mutual funds are tax-exempt up to ₹1,25,000 per financial year under Section 112A.',
        action: 'Book unrealized long-term capital gains up to ₹1.25 Lakh each year and re-invest to step-up your purchase cost basis legally.',
        applicableRegime: 'Both Regimes',
        urgency: 'Seasonal'
      },
      {
        id: 'tip-5',
        title: 'Section 24(b): Home Loan Interest Deduction up to ₹2 Lakhs',
        category: 'Housing & Real Estate',
        savings: 'Save up to ₹62,400 in 30% slab',
        summary: 'Claim up to ₹2,00,000 deduction on interest payable on borrowed capital for self-occupied residential house property.',
        action: 'Download the provisional interest certificate from your lending bank and declare it under Income from House Property.',
        applicableRegime: 'Old Tax Regime',
        urgency: 'High Impact'
      },
      {
        id: 'tip-6',
        title: 'House Rent Allowance (HRA) Exemption u/s 10(13A)',
        category: 'Salaried Deductions',
        savings: 'Varies by basic salary & rent paid',
        summary: 'Salaried taxpayers living in rented accommodation can claim significant HRA exemption based on actual rent paid minus 10% of salary.',
        action: 'Collect rent receipts and ensure landlord PAN is recorded if total rent paid exceeds ₹1,00,000 annually.',
        applicableRegime: 'Old Tax Regime',
        urgency: 'Ongoing'
      },
      {
        id: 'tip-7',
        title: 'Section 80TTA & 80TTB: Savings Bank Interest Relief',
        category: 'Banking & Deposits',
        savings: 'Save up to ₹3,120 (General) / ₹15,600 (Seniors)',
        summary: 'Section 80TTA allows deduction up to ₹10,000 on savings interest for individuals. Senior citizens can claim up to ₹50,000 under Section 80TTB covering FD interest.',
        action: 'Do not omit savings account interest in your return; claim the automatic exemption under Section 80TTA in your ITR computation.',
        applicableRegime: 'Old Tax Regime',
        urgency: 'Filing Tip'
      }
    ];

    // Pick rotating active tip based on date
    const rotationIndex = dayOfYear % fallbackTips.length;
    const activeTip = fallbackTips[rotationIndex];

    try {
      const ai = getGenAI();
      if (ai) {
        // Fetch personalized daily insight from Gemini 3.8 Flash
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Today is ${dateStr}. Provide an actionable, high-value Indian Income Tax saving tip for Indian taxpayers (Salaried or Small Business, Assessment Year 2025-26).
Focus on legal exemptions under the Indian Income Tax Act 1961 (such as 80C, 80D, 80CCD, HRA, 24b, Capital Gains, New vs Old Regime comparison).
Respond with a JSON object strictly matching this schema:
{
  "title": "Short punchy title",
  "category": "e.g. Salaried / Investments / Healthcare / Regime",
  "savings": "e.g. Save up to ₹46,800",
  "summary": "2 concise sentences explaining the tax rule",
  "action": "1 concrete action the taxpayer should take today",
  "applicableRegime": "New Tax Regime | Old Tax Regime | Both Regimes",
  "aiAnalysis": "A 2-sentence practical advice on how to maximize this benefit for AY 2025-26"
}`,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          return res.json({
            date: dateStr,
            dayOfYear,
            tip: {
              ...activeTip,
              ...parsed,
              id: `gemini-tip-${dayOfYear}`,
            },
            allTips: fallbackTips,
            isAiGenerated: true,
          });
        }
      }
    } catch (err) {
      console.warn('Gemini API call skipped or failed, using robust curated fallback:', err);
    }

    // Fallback response
    return res.json({
      date: dateStr,
      dayOfYear,
      tip: activeTip,
      allTips: fallbackTips,
      isAiGenerated: false,
    });
  });

  // Serve static or Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = typeof __dirname !== 'undefined'
      ? (path.basename(__dirname) === 'dist' ? __dirname : path.join(__dirname, 'dist'))
      : path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
