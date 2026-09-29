import type { DataCollection } from '@wix/astro/builders';

export const collectionIdSuffix = 'app-settings';

export default {
  idSuffix: 'app-settings',
  displayName: 'Forms PDF App Settings',
  displayField: 'instanceId',
  fields: [
    { key: 'instanceId', type: 'TEXT', displayName: 'instanceId' },
    { key: 'defaultTemplateId', type: 'TEXT', displayName: 'defaultTemplateId' },
    { key: 'locale', type: 'TEXT', displayName: 'locale' },
    { key: 'hideChecklist', type: 'BOOLEAN', displayName: 'hideChecklist' },
    { key: 'config', type: 'OBJECT', displayName: 'config', objectOptions: { fields: [] } },
  ],
  dataPermissions: { itemInsert: 'PRIVILEGED', itemRead: 'PRIVILEGED', itemRemove: 'PRIVILEGED', itemUpdate: 'PRIVILEGED' },
  indexes: [{ fields: [{ path: 'instanceId' }], unique: true }],
  initialData: [],
} satisfies DataCollection;
