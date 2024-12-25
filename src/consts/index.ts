export const pages = [
  "users", "vehicules", "deplacements", "rechanges",
  "vidange", "analytics", "graphiques",
  "depensesSupplementaires", "change_type_carburant", "prix", "taxe",
]

export const links = pages.map(page => ({ label: page, href: page === "vehicules" ? '/' : '/' + page }))