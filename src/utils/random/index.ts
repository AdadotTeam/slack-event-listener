import crypto from "crypto";
import MersenneTwister from "mersenne-twister";

/**
 * Provides a MersenneTwister pseudo-random generator.
 * @type {MersenneTwister}
 */
const generator: MersenneTwister = new MersenneTwister();

/**
 * Resolves a random number within a range.
 *
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
export const rand = (min: number, max: number): number => {
  return Math.floor(generator.random() * (max - min + 1) + min);
};

/**
 * Pauses for a specific or randomized duration.
 *
 * @param {number} min
 * @param {number} max
 * @return {Promise<void>}
 */
export const waitForTimeout = async (min: number, max?: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(
      () => {
        resolve();
      },
      max ? rand(min, max) : min
    );
  });

export function getRandomHexBytes(length = 20): string {
  return crypto.randomBytes(length).toString("hex");
}

export const incrementalExponentialDelay = (RETRY_BASE_DELAY: number) => {
  let attempt = 0;
  return () => {
    const exponentialDelay = RETRY_BASE_DELAY * 2 ** attempt;
    attempt += 1;
    return exponentialDelay - RETRY_BASE_DELAY + RETRY_BASE_DELAY;
  };
};
