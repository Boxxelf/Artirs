// Price formatter utility
// Exchange rate: 1 USD = 7.2 CNY (approximate)
const USD_TO_CNY_RATE = 7.2;

/**
 * Format price based on language
 * @param {number} priceUSD - Price in USD
 * @param {string} language - Language code ('en' or 'zh')
 * @returns {object} - Formatted price object with amount, currency, and symbol
 */
export const formatPrice = (priceUSD, language = 'en') => {
  if (language === 'zh') {
    const priceCNY = Math.round(priceUSD * USD_TO_CNY_RATE);
    return {
      amount: priceCNY,
      currency: 'CNY',
      symbol: '¥',
      formatted: `¥${priceCNY}`,
    };
  }
  return {
    amount: priceUSD,
    currency: 'USD',
    symbol: '$',
    formatted: `$${priceUSD}`,
  };
};

/**
 * Format price with unit (per hour)
 * @param {number} priceUSD - Price in USD
 * @param {string} language - Language code ('en' or 'zh')
 * @returns {string} - Formatted price string with unit
 */
export const formatPriceWithUnit = (priceUSD, language = 'en') => {
  const price = formatPrice(priceUSD, language);
  const unit = language === 'zh' ? '/小时' : '/hr';
  return `${price.formatted}${unit}`;
};
