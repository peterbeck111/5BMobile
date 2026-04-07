export interface Transfer {
  toLocId: string;
  estArrDate: string;
  item: string;
  qtyExpected: number;
  stockOnHand: number;
}

export const mockTransfers: Transfer[] = [
  { toLocId: '1010', estArrDate: '4/10/2026', item: '100015000', qtyExpected: 5, stockOnHand: 10 },
  { toLocId: '1010', estArrDate: '4/8/2026', item: '100015000', qtyExpected: 5, stockOnHand: 10 },
  { toLocId: '1013', estArrDate: '4/10/2026', item: '100015000', qtyExpected: 5, stockOnHand: 0 },
  { toLocId: '1016', estArrDate: '4/7/2026', item: '100015000', qtyExpected: 3, stockOnHand: 0 },
  { toLocId: '1011', estArrDate: '4/8/2026', item: '100015000', qtyExpected: 8, stockOnHand: 2 },
  { toLocId: '1012', estArrDate: '4/8/2026', item: '100015000', qtyExpected: 7, stockOnHand: 0 },
  { toLocId: '1014', estArrDate: '4/6/2026', item: '100015000', qtyExpected: 6, stockOnHand: 0 },
  { toLocId: '1015', estArrDate: '4/4/2026', item: '100015000', qtyExpected: 4, stockOnHand: 0 },
];

/** Maps product IDs (from products.ts) to API item codes */
export const productToItemMap: Record<string, string> = {
  '1': '100015000', // Sour Patch Kids Easter Jelly Beans
  '2': '100015062', // Easter Gingham Basket
  '3': '100015063', // Disney Stitch Chalk Set 3-Pack
  '4': '100015064', // Eva Tote Bag 18in X 8.8in
  '5': '999910', // Mystery Squishy Dumpling
};

export function getTransfersForStore(
  allTransfers: Transfer[],
  storeId: string,
  productId?: string
): Transfer[] {
  const itemCode = productId ? productToItemMap[productId] : undefined;
  return allTransfers.filter(
    (t) => t.toLocId === storeId && (!itemCode || t.item === itemCode)
  );
}

/** Returns true if the given product has any inventory data */
export function hasInventoryData(productId: string): boolean {
  return productId in productToItemMap;
}
