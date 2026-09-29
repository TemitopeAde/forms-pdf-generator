import { extensions } from '@wix/astro/builders'

import appSettingsCollection from './app-settings';

import formSettingsCollection from './form-settings';

import pdfTemplatesCollection from './pdf-templates';

import pdfRecordsCollection from './pdf-records';

import processedEventsCollection from './processed-events';

import automationActionsCollection from './automation-actions';

import usageRecordsCollection from './usage-records';

import appInstancesCollection from './app-instances';
import exportJobsCollection from './export-jobs';

export default extensions.dataCollections({
  id: '9f3f06da-e6c4-480c-8ec0-a5b248710ff3',
  name: 'Data Collections',
  collections: [
    appSettingsCollection,
    formSettingsCollection,
    pdfTemplatesCollection,
    pdfRecordsCollection,
    processedEventsCollection,
    automationActionsCollection,
    usageRecordsCollection,
    appInstancesCollection,
    exportJobsCollection
  ],
});
