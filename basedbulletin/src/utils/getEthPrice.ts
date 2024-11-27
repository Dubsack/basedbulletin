const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
const FALLBACK_PRICE = 1800
let cachedPrice: number | null = null
let lastFetchTime = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

export async function getEthPrice(): Promise<number> {
  // Return cached price if it's still valid
  if (cachedPrice && Date.now() - lastFetchTime < CACHE_DURATION) {
    return cachedPrice
  }

  try {
    const response = await fetch(COINGECKO_API, {
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      return FALLBACK_PRICE
    }

    const data = await response.json()
    cachedPrice = data.ethereum.usd
    lastFetchTime = Date.now()
    return cachedPrice
  } catch (error) {
    console.error('Error fetching ETH price:', error)
    return cachedPrice || FALLBACK_PRICE
  }
}
