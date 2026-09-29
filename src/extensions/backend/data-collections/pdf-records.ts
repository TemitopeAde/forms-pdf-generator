import type { DataCollection } from '@wix/astro/builders';

export const collectionIdSuffix = 'pdf-records';

export default {
  idSuffix: 'pdf-records',
  displayName: 'Forms PDF Pdf Records',
  displayField: 'submissionId',
  fields: [
    { key: 'uniqueKey', type: 'TEXT', displayName: 'uniqueKey' },
    { key: 'instanceId', type: 'TEXT', displayName: 'instanceId' },
    { key: 'formId', type: 'TEXT', displayName: 'formId' },
    { key: 'submissionId', type: 'TEXT', displayName: 'submissionId' },
    { key: 'templateId', type: 'TEXT', displayName: 'templateId' },
    { key: 'templateVersion', type: 'NUMBER', displayName: 'templateVersion' },
    { key: 'fileId', type: 'TEXT', displayName: 'fileId' },
    { key: 'status', type: 'TEXT', displayName: 'status' },
    { key: 'errorCode', type: 'TEXT', displayName: 'errorCode' },
    { key: 'createdAt', type: 'DATETIME', displayName: 'createdAt' },
  ],
  dataPermissions: { itemInsert: 'PRIVILEGED', itemRead: 'PRIVILEGED', itemRemove: 'PRIVILEGED', itemUpdate: 'PRIVILEGED' },
  indexes: [{ fields: [{ path: 'uniqueKey' }], unique: true }],
  initialData: [],
} satisfies DataCollection;
