import { BuyerProfile, BuyerZone, Property, MatchGrade } from "@prisma/client";

type BuyerWithZones = BuyerProfile & { zones: BuyerZone[] };

interface MatchResult {
  score: number;
  grade: MatchGrade;
  isCompatible: boolean;
  factors: {
    name: string;
    score: number;
    max: number;
    reason?: string;
  }[];
}

export function calculateMatchScore(
  buyer: BuyerWithZones,
  property: Property
): MatchResult {
  const factors: MatchResult["factors"] = [];
  let totalScore = 0;

  // 1. LOCALISATION (30 points max)
  const zoneMatch = buyer.zones.some(
    (z) =>
      z.commune.toLowerCase() === property.commune.toLowerCase() ||
      z.postalCode === property.postalCode
  );
  const locationScore = zoneMatch ? 30 : 0;
  totalScore += locationScore;
  factors.push({
    name: "Localisation",
    score: locationScore,
    max: 30,
    reason: zoneMatch ? "Zone correspondante" : "Hors zone",
  });

  // 2. BUDGET (25 points max)
  let budgetScore = 0;
  const inBudget =
    property.askingPrice >= buyer.budgetMin &&
    property.askingPrice <= buyer.budgetMax;

  if (inBudget) {
    budgetScore = 25;
  } else {
    // Partial score if close
    const deviation =
      property.askingPrice > buyer.budgetMax
        ? (property.askingPrice - buyer.budgetMax) / buyer.budgetMax
        : (buyer.budgetMin - property.askingPrice) / buyer.budgetMin;

    if (deviation < 0.1) budgetScore = 15; // 10% deviation = 15 pts
    else if (deviation < 0.2) budgetScore = 5; // 20% deviation = 5 pts
  }
  totalScore += budgetScore;
  factors.push({
    name: "Budget",
    score: budgetScore,
    max: 25,
    reason: inBudget ? "Dans le budget" : "Hors budget",
  });

  // 3. TIMING (15 points max)
  const timingCompatible = isTimingCompatible(buyer.timing, property.timing);
  const timingScore = timingCompatible ? 15 : 5;
  totalScore += timingScore;
  factors.push({
    name: "Timing",
    score: timingScore,
    max: 15,
    reason: timingCompatible ? "Timing compatible" : "Timing différent",
  });

  // 4. CRITÈRES (20 points max)
  let criteriaScore = 0;

  // Bedrooms
  if (!buyer.minBedrooms || property.bedrooms >= buyer.minBedrooms) {
    criteriaScore += 5;
  }

  // Surface
  if (!buyer.minSurface || property.surface >= buyer.minSurface) {
    criteriaScore += 5;
  }

  // Property type
  if (
    buyer.propertyTypes.length === 0 ||
    buyer.propertyTypes.includes(property.propertyType)
  ) {
    criteriaScore += 10;
  }

  totalScore += criteriaScore;
  factors.push({
    name: "Critères",
    score: criteriaScore,
    max: 20,
  });

  // 5. DEALBREAKERS (-100 if hit)
  const hasDeadbreaker = buyer.dealbreakers.some(
    (d) =>
      property.constraints.map((c) => c.toLowerCase()).includes(d.toLowerCase())
  );

  if (hasDeadbreaker) {
    return {
      score: 0,
      grade: "C",
      isCompatible: false,
      factors: [
        {
          name: "Dealbreaker",
          score: -100,
          max: 0,
          reason: "Critère éliminatoire détecté",
        },
      ],
    };
  }

  // 6. MUST HAVE BONUS (10 points max)
  const mustHaveMatches = buyer.mustHave.filter((m) =>
    property.features.map((f) => f.toLowerCase()).includes(m.toLowerCase())
  ).length;
  const mustHaveScore = Math.min(10, mustHaveMatches * 3);
  totalScore += mustHaveScore;
  factors.push({
    name: "Must have",
    score: mustHaveScore,
    max: 10,
    reason: `${mustHaveMatches} critère(s) trouvé(s)`,
  });

  // Calculate grade
  let grade: MatchGrade;
  if (totalScore >= 80) grade = "A";
  else if (totalScore >= 60) grade = "B";
  else grade = "C";

  return {
    score: totalScore,
    grade,
    isCompatible: totalScore >= 40,
    factors,
  };
}

function isTimingCompatible(buyerTiming: string, propertyTiming: string): boolean {
  const timingOrder = ["URGENT", "SHORT_TERM", "MEDIUM_TERM", "FLEXIBLE"];
  const buyerIndex = timingOrder.indexOf(buyerTiming);
  const propertyIndex = timingOrder.indexOf(propertyTiming);

  // Compatible if within 1 step of each other, or property is more flexible
  return Math.abs(buyerIndex - propertyIndex) <= 1 || propertyIndex >= buyerIndex;
}

export function getGradeColor(grade: MatchGrade): string {
  switch (grade) {
    case "A":
      return "bg-green-500";
    case "B":
      return "bg-blue-500";
    case "C":
      return "bg-yellow-500";
    default:
      return "bg-gray-500";
  }
}

export function getGradeLabel(grade: MatchGrade): string {
  switch (grade) {
    case "A":
      return "Excellent match";
    case "B":
      return "Bon match";
    case "C":
      return "Match possible";
    default:
      return "Non compatible";
  }
}
