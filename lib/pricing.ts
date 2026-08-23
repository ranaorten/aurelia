// Shared pricing config/helpers used by both the booking form (client-side
// preview) and the bookings API (server-side, authoritative calculation).

export const TAX_RATE = 0.1; // 10% — placeholder until real tax rules are defined.

export function calculateNights(checkIn: Date, checkOut: Date): number {
  const msPerNight = 1000 * 60 * 60 * 24;
  return Math.round((checkOut.getTime() - checkIn.getTime()) / msPerNight);
}

export function calculateTotalPrice(basePrice: number, nights: number) {
  const subtotal = basePrice * nights;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;
  return { subtotal, tax, total };
}
