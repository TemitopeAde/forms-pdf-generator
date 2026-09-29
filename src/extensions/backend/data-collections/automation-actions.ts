import type { DataCollection } from '@wix/astro/builders';

export const collectionIdSuffix = 'automation-actions';

export default {
  idSuffix: 'automation-actions',
  displayName: 'Forms PDF Automation Actions',
  displayField: 'actionType',
  fields: [
    { key: 'uniqueKey', type: 'TEXT', displayName: 'uniqueKey' },
    { key: 'instanceId', type: 'TEXT', displayName: 'instanceId' },
    { key: 'submissionId', type: 'TEXT', displayName: 'submissionId' },
    { key: 'actionType', type: 'TEXT', displayName: 'actionType' },
    { key: 'status', type: 'TEXT', displayName: 'status' },
    { key: 'attemptCount', type: 'NUMBER', displayName: 'attemptCount' },
    { key: 'errorCode', type: 'TEXT', displayName: 'errorCode' },
    { key: 'externalId', type: 'TEXT', displayName: 'externalId' },
    { key: 'lastAttemptAt', type: 'DATETIME', displayName: 'lastAttemptAt' },
    { key: 'processedAt', type: 'DATETIME', displayName: 'processedAt' },
  ],
  dataPermissions: { itemInsert: 'PRIVILEGED', itemRead: 'PRIVILEGED', itemRemove: 'PRIVILEGED', itemUpdate: 'PRIVILEGED' },
  indexes: [{ fields: [{ path: 'uniqueKey' }], unique: true }],
  initialData: [],
} satisfies DataCollection;
