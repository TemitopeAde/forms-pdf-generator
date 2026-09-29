import type { DataCollection } from '@wix/astro/builders';

export default {
  idSuffix: 'export-jobs',
  displayName: 'Forms PDF Export Jobs',
  displayField: 'status',
  fields: [
    { key: 'instanceId', type: 'TEXT', displayName: 'instanceId' },
    { key: 'status', type: 'TEXT', displayName: 'status' },
    { key: 'fileId', type: 'TEXT', displayName: 'fileId' },
    { key: 'recordIds', type: 'ARRAY_STRING', displayName: 'recordIds' },
    { key: 'errorCode', type: 'TEXT', displayName: 'errorCode' },
    { key: 'createdAt', type: 'DATETIME', displayName: 'createdAt' },
    { key: 'completedAt', type: 'DATETIME', displayName: 'completedAt' },
  ],
  dataPermissions: { itemInsert: 'PRIVILEGED', itemRead: 'PRIVILEGED', itemRemove: 'PRIVILEGED', itemUpdate: 'PRIVILEGED' },
  indexes: [{ fields: [{ path: 'instanceId' }] }],
  initialData: [],
} satisfies DataCollection;
