export interface Cryptocurrency {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
}

export interface WatchlistItem {
  id: string;
  userId: string;
  cryptocurrencyId: string;
  cryptocurrency: Cryptocurrency;
  createdAt: string;
}
