export const PRICES: Record<string, number> = {
    free: 0,
    free_yearly: 0,
    starter: 1500,
    starter_yearly: 15000,
    school: 3000,
    school_yearly: 30000,
    enterprise: 5000,
    enterprise_yearly: 50000
};

export function calculatePlanSwitch(
    currentPlan: string,
    currentExpiresAt: Date | null,
    targetPlan: string
) {
    const targetPrice = PRICES[targetPlan];
    if (targetPrice === undefined) {
        throw new Error("Invalid target plan");
    }

    const currentPrice = PRICES[currentPlan] || 0;
    
    let credit = 0;
    const now = new Date();

    if (currentExpiresAt && currentExpiresAt > now && currentPrice > 0) {
        const isYearly = currentPlan.endsWith("_yearly");
        const totalDaysInCycle = isYearly ? 365 : 30;
        
        // Calculate remaining days
        const diffTime = currentExpiresAt.getTime() - now.getTime();
        const remainingDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
        
        if (remainingDays > 0) {
            const dailyRate = currentPrice / totalDaysInCycle;
            credit = Math.floor(remainingDays * dailyRate);
        }
    }

    let totalDue = targetPrice - credit;
    let extraDays = 0;

    if (totalDue <= 0) {
        const leftoverCredit = credit - targetPrice; 
        totalDue = 0;
        
        if (targetPrice > 0) {
            const targetIsYearly = targetPlan.endsWith("_yearly");
            const targetTotalDays = targetIsYearly ? 365 : 30;
            const targetDailyRate = targetPrice / targetTotalDays;
            
            extraDays = Math.floor(credit / targetDailyRate);
        }
    }

    return {
        subtotal: targetPrice,
        creditApplied: credit,
        totalDue: totalDue,
        extraDays: extraDays
    };
}
