import type { DataCollection } from '@wix/astro/builders';

export const collectionIdSuffix = 'app-instances';

export default {
  idSuffix: 'app-instances',
  displayName: 'Forms PDF App Instances',
  displayField: 'instanceId',
  fields: [
    { key: 'instanceId', type: 'TEXT', displayName: 'instanceId' },
    { key: 'siteId', type: 'TEXT', displayName: 'siteId' },
    { key: 'planId', type: 'TEXT', displayName: 'planId' },
    { key: 'installedAt', type: 'DATETIME', displayName: 'installedAt' },
    { key: 'lastVerifiedAt', type: 'DATETIME', displayName: 'lastVerifiedAt' },
  ],
  dataPermissions: { itemInsert: 'PRIVILEGED', itemRead: 'PRIVILEGED', itemRemove: 'PRIVILEGED', itemUpdate: 'PRIVILEGED' },
  indexes: [{ fields: [{ path: 'instanceId' }], unique: true }],
  initialData: [],
} satisfies DataCollection;
