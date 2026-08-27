export const LTFRB_RATES = {
    baseKm: 4,
    regular: {
        baseFare: 11.00,
        succeedingKm: 1.90,
    },
    discounted: { // 20% off for Students, Seniors, PWDs
        baseFare: 8.75,
        succeedingKm: 1.50,
    }
};

/**
 * Calculates the LTFRB non-aircon bus fare based on distance and passenger type.
 * Includes standard Philippine fare rounding to the nearest 0.25 centavos.
 *
 * @param distanceKm The total distance of the trip in kilometers
 * @param isDiscounted True if passenger is Student, Senior, or PWD
 * @returns The calculated fare in PHP
 */
export function calculateLTFRBFare(distanceKm: number, isDiscounted: boolean = false): number {
    // Return 0 for invalid distances
    if (distanceKm <= 0) return 0;

    const rates = isDiscounted ? LTFRB_RATES.discounted : LTFRB_RATES.regular;

    // If the trip is within the first 4km, charge only the base fare
    if (distanceKm <= LTFRB_RATES.baseKm) {
        return rates.baseFare;
    }

    // Calculate the excess kilometers
    const excessKm = distanceKm - LTFRB_RATES.baseKm;

    // Calculate exact fare
    const exactFare = rates.baseFare + (excessKm * rates.succeedingKm);

    // LTFRB matrices usually round to the nearest 0.25 (25 centavos)
    const roundedFare = Math.round(exactFare * 4) / 4;

    return roundedFare;
}
