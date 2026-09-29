import type { DataCollection } from '@wix/astro/builders';

export const collectionIdSuffix = 'pdf-templates';

export default {
  idSuffix: 'pdf-templates',
  displayName: 'Forms PDF Pdf Templates',
  displayField: 'name',
  fields: [
    { key: 'instanceId', type: 'TEXT', displayName: 'instanceId' },
    { key: 'name', type: 'TEXT', displayName: 'name' },
    { key: 'version', type: 'NUMBER', displayName: 'version' },
    { key: 'isDefault', type: 'BOOLEAN', displayName: 'isDefault' },
    { key: 'config', type: 'OBJECT', displayName: 'config', objectOptions: { fields: [] } },
  ],
  dataPermissions: { itemInsert: 'PRIVILEGED', itemRead: 'PRIVILEGED', itemRemove: 'PRIVILEGED', itemUpdate: 'PRIVILEGED' },
  indexes: [{ fields: [{ path: 'instanceId' }] }],
  initialData: [],
} satisfies DataCollection;
