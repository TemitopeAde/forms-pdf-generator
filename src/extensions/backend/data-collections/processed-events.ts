import type { DataCollection } from '@wix/astro/builders';

export const collectionIdSuffix = 'processed-events';

export default {
  idSuffix: 'processed-events',
  displayName: 'Forms PDF Processed Events',
  displayField: 'eventId',
  fields: [
    { key: 'uniqueKey', type: 'TEXT', displayName: 'uniqueKey' },
    { key: 'instanceId', type: 'TEXT', displayName: 'instanceId' },
    { key: 'eventId', type: 'TEXT', displayName: 'eventId' },
    { key: 'eventType', type: 'TEXT', displayName: 'eventType' },
    { key: 'formId', type: 'TEXT', displayName: 'formId' },
    { key: 'submissionId', type: 'TEXT', displayName: 'submissionId' },
    { key: 'status', type: 'TEXT', displayName: 'status' },
    { key: 'attemptCount', type: 'NUMBER', displayName: 'attemptCount' },
    { key: 'errorCode', type: 'TEXT', displayName: 'errorCode' },
    { key: 'receivedAt', type: 'DATETIME', displayName: 'receivedAt' },
    { key: 'processedAt', type: 'DATETIME', displayName: 'processedAt' },
  ],
  dataPermissions: { itemInsert: 'PRIVILEGED', itemRead: 'PRIVILEGED', itemRemove: 'PRIVILEGED', itemUpdate: 'PRIVILEGED' },
  indexes: [{ fields: [{ path: 'uniqueKey' }], unique: true }],
  initialData: [],
} satisfies DataCollection;
