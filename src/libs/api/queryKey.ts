export const wardKeys = {
  base: ['ward'] as const,
  requestList: (wardId: number, teamId: number, year: number, month: number) =>
    [...wardKeys.base, 'requests', wardId, teamId, year, month] as const,
  shiftList: (wardId: number, teamId: number, year: number, month: number) =>
    [...wardKeys.base, 'shifts', wardId, teamId, year, month] as const,
  linkedMembers: (wardId: number, teamId: number) =>
    [...wardKeys.base, 'linked', wardId, teamId] as const,
};
