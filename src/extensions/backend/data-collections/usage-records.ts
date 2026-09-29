import type { DataCollection } from '@wix/astro/builders';

export const collectionIdSuffix = 'usage-records';

export default {
  idSuffix: 'usage-records',
  displayName: 'Forms PDF Usage Records',
  displayField: 'period',
  fields: [
    { key: 'uniqueKey', type: 'TEXT', displayName: 'uniqueKey' },
    { key: 'instanceId', type: 'TEXT', displayName: 'instanceId' },
    { key: 'period', type: 'TEXT', displayName: 'period' },
    { key: 'pdfCount', type: 'NUMBER', displayName: 'pdfCount' },
  ],
  dataPermissions: { itemInsert: 'PRIVILEGED', itemRead: 'PRIVILEGED', itemRemove: 'PRIVILEGED', itemUpdate: 'PRIVILEGED' },
  indexes: [{ fields: [{ path: 'uniqueKey' }], unique: true }],
  initialData: [],
} satisfies DataCollection;
