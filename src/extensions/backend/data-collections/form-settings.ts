import type { DataCollection } from '@wix/astro/builders';

export const collectionIdSuffix = 'form-settings';

export default {
  idSuffix: 'form-settings',
  displayName: 'Forms PDF Form Settings',
  displayField: 'formId',
  fields: [
    { key: 'uniqueKey', type: 'TEXT', displayName: 'uniqueKey' },
    { key: 'instanceId', type: 'TEXT', displayName: 'instanceId' },
    { key: 'formId', type: 'TEXT', displayName: 'formId' },
    { key: 'templateId', type: 'TEXT', displayName: 'templateId' },
    { key: 'automatic', type: 'BOOLEAN', displayName: 'automatic' },
    { key: 'configured', type: 'BOOLEAN', displayName: 'configured' },
    { key: 'delivery', type: 'OBJECT', displayName: 'delivery', objectOptions: { fields: [] } },
  ],
  dataPermissions: { itemInsert: 'PRIVILEGED', itemRead: 'PRIVILEGED', itemRemove: 'PRIVILEGED', itemUpdate: 'PRIVILEGED' },
  indexes: [{ fields: [{ path: 'uniqueKey' }], unique: true }],
  initialData: [],
} satisfies DataCollection;
