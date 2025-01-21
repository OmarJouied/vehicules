export const pages = [
  "users", "vehicules", "deplacements", "rechanges",
  "vidange", "analytics", "graphiques",
  "depensesSupplementaires", "vehiculeTypeCarburant", "prix", "taxe",
]

export const links = pages.map(page => ({ label: page, href: '/' + page }))