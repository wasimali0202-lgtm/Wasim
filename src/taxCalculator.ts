import { IncomeDetails, DeductionDetails, TaxCalculationResult } from './types';

export function calculateIncomeTax(
  income: IncomeDetails,
  deductions: DeductionDetails,
  taxZoneType: 'metro_city' | 'non_metro' | 'dhaka_ctg_city' | 'other_city' | 'non_city' = 'metro_city',
  taxpayerType: 'salaried' | 'business' | 'freelancer' | 'senior' = 'salaried'
): TaxCalculationResult {
  // 1. Calculate Gross Income
  const grossSalary = 
    (income.basicSalary || 0) +
    (income.houseRentAllowance || 0) +
    (income.medicalAllowance || 0) +
    (income.conveyanceAllowance || 0) +
    (income.festivalBonus || 0) +
    (income.otherAllowances || 0);

  const netRental = Math.max(0, (income.rentalIncome || 0) - (income.rentalExpenses || 0));
  const netBusiness = Math.max(0, (income.businessRevenue || 0) - (income.businessExpenses || 0));
  const capitalGains = income.capitalGains || 0;
  const bankInterest = income.bankInterest || 0;
  const otherIncome = income.otherIncome || 0;

  const totalGrossIncome = grossSalary + netRental + netBusiness + capitalGains + bankInterest + otherIncome;

  // 2. Standard Deduction & Exemptions under Salary
  // Standard Deduction u/s 16(ia): ₹50,000 for salaried
  const standardDeduction = grossSalary > 0 ? 50000 : 0;
  const exemptHouseRent = Math.min(income.houseRentAllowance || 0, Math.min((income.basicSalary || 0) * 0.5, 200000));
  const totalExemptions = standardDeduction + (grossSalary > 0 ? exemptHouseRent : 0);

  const incomeAfterExemptions = Math.max(0, totalGrossIncome - totalExemptions);

  // 3. Chapter VI-A Deductions (Sec 80C, 80D)
  // Section 80C capped at ₹1,50,000 (PF, DPS/PPF, Life Insurance, ELSS, Govt securities)
  const gross80C = 
    (deductions.providentFund || 0) +
    (deductions.dpsSavings || 0) +
    (deductions.lifeInsurancePremium || 0) +
    (deductions.governmentSecurities || 0);
  const capped80C = Math.min(gross80C, 150000);

  // Section 80D capped at ₹25,000 (senior citizen ₹50,000)
  const max80D = taxpayerType === 'senior' ? 50000 : 25000;
  const capped80D = Math.min(deductions.healthInsurance || 0, max80D);

  const otherAllowableDeductions = Math.min(deductions.donationApproved || 0, 50000) + (deductions.otherInvestments || 0);
  const totalEligibleDeductions = capped80C + capped80D + otherAllowableDeductions;

  const taxableIncome = Math.max(0, incomeAfterExemptions - totalEligibleDeductions);

  // 4. Tax Slabs (Indian New Tax Regime u/s 115BAC / Progressive Slabs)
  const thresholdZero = 300000;

  const slabsConfig = [
    { name: 'Up to ₹3,00,000 (0% Nil)', limit: 300000, rate: 0 },
    { name: '₹3,00,001 to ₹7,00,000 (5%)', limit: 400000, rate: 0.05 },
    { name: '₹7,00,001 to ₹10,00,000 (10%)', limit: 300000, rate: 0.10 },
    { name: '₹10,00,001 to ₹12,00,000 (15%)', limit: 200000, rate: 0.15 },
    { name: '₹12,00,001 to ₹15,00,000 (20%)', limit: 300000, rate: 0.20 },
    { name: 'Above ₹15,00,000 (30%)', limit: Infinity, rate: 0.30 },
  ];

  let remaining = taxableIncome;
  let grossTaxLiability = 0;
  const slabBreakdown = [];

  for (const slab of slabsConfig) {
    if (remaining <= 0) {
      slabBreakdown.push({
        slabName: slab.name,
        rate: slab.rate * 100,
        taxableAmount: 0,
        taxAmount: 0,
      });
      continue;
    }

    const amountInSlab = Math.min(remaining, slab.limit);
    const taxInSlab = Math.round(amountInSlab * slab.rate);
    grossTaxLiability += taxInSlab;
    remaining -= amountInSlab;

    slabBreakdown.push({
      slabName: slab.name,
      rate: slab.rate * 100,
      taxableAmount: amountInSlab,
      taxAmount: taxInSlab,
    });
  }

  // 5. Section 87A Tax Rebate (Full rebate if taxable income is up to ₹7,00,000 under New Regime)
  let investmentRebate = 0;
  if (taxableIncome <= 700000) {
    investmentRebate = grossTaxLiability; // 87A rebate wipes out tax entirely
  } else {
    // Proportional rebate for chapter VI-A investments
    investmentRebate = Math.min(grossTaxLiability, Math.round(totalEligibleDeductions * 0.15));
  }

  // Add 4% Health & Education Cess
  const baseTaxAfterRebate = Math.max(0, grossTaxLiability - investmentRebate);
  const healthAndEducationCess = Math.round(baseTaxAfterRebate * 0.04);
  const netTaxAfterRebate = baseTaxAfterRebate + healthAndEducationCess;

  // Minimum Tax rule (nominal administrative baseline if applicable)
  const minimumTax = 0;
  const finalTaxLiability = netTaxAfterRebate;

  // 6. Advance Tax Paid & TDS
  const simulatedTds = Math.round((income.bankInterest || 0) * 0.10) + Math.round((grossSalary > 600000 ? 18500 : 0));
  const advanceTaxPaid = simulatedTds;

  const netDiff = finalTaxLiability - advanceTaxPaid;
  const netTaxPayable = netDiff > 0 ? netDiff : 0;
  const refundAmount = netDiff < 0 ? Math.abs(netDiff) : 0;

  return {
    grossIncome: totalGrossIncome,
    exemptIncome: totalExemptions,
    taxableIncome,
    slabBreakdown,
    grossTaxLiability,
    totalInvestment: totalEligibleDeductions,
    investmentRebate,
    netTaxAfterRebate,
    minimumTax,
    finalTaxLiability,
    advanceTaxPaid,
    netTaxPayable,
    refundAmount,
  };
}
