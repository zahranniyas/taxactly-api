export function calcMonthlyPAYE(gross) {
  const slabs = [
    { limit: 150000, rate: 0 },
    { limit: 233333.3, rate: 0.06 },
    { limit: 291666.7, rate: 0.18 },
    { limit: 350000, rate: 0.24 },
    { limit: 408333.3, rate: 0.3 },
    { limit: Infinity, rate: 0.36 },
  ];

  let remainder = gross,
    tax = 0,
    prev = 0;
  for (const { limit, rate } of slabs) {
    const slice = Math.min(remainder, limit - prev);
    tax += slice * rate;
    remainder -= slice;
    prev = limit;
    if (remainder <= 0) break;
  }
  return Math.round(tax);
}
