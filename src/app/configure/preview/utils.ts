import { BASE_PRICE, PRODUCT_PRICES } from '@/config/products';
import { CaseFinish, CaseMaterial } from 'generated/prisma';

export function getTotalCasePrice(finish: CaseFinish | null, material: CaseMaterial | null) {
  let totalPrice = BASE_PRICE;
  if (material === 'polycarbonate') totalPrice += PRODUCT_PRICES.material.polycarbonate;
  if (finish === 'textured') totalPrice += PRODUCT_PRICES.finish.textured;

  return totalPrice;
}
