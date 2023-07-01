const mapping: Record<string, string> = {
  companies: 'company',
  conversions: 'conversion',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
