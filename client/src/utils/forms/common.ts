// Mirrors objectId in server/types/common.ts
const OBJECT_ID = /^[0-9a-f]{24}$/i;

export const isObjectId = (id: any) =>
  typeof id === 'string' && OBJECT_ID.test(id);

export const validateIdList = (ids: any, label: string) => {
  if (!Array.isArray(ids)) {
    return `${label} must be a list`;
  }
  if (ids.some((id) => !isObjectId(id))) {
    return `${label} contains an invalid id`;
  }
  return null;
};
