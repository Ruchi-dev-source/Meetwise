// No request body, path params, or query params are currently accepted by
// any /analytics/* endpoint — every response is scoped entirely by the
// authenticated caller's organizationId (from req.user, already verified
// by the authenticate middleware). This file is kept as the designated
// place for future query-param schemas (e.g. a date range filter) so
// adding one doesn't require restructuring the module.
export {};
