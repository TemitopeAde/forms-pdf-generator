import { app } from '@wix/astro/builders';
import myPage from './extensions/dashboard/pages/my-page/my-page.extension.ts';

import dataCollections from './extensions/backend/data-collections/data-collections.extension.ts';

import submissionCreated from './extensions/backend/events/submission-created/submission-created.extension.ts';

import submissionUpdated from './extensions/backend/events/submission-updated/submission-updated.extension.ts';

import formsPdfTools from './extensions/backend/app-tools/forms-pdf-tools/forms-pdf-tools.extension.ts';

import pdfToolsProvider from './extensions/backend/service-plugins/pdf-tools-provider/pdf-tools-provider.extension.ts';

import fileReady from './extensions/backend/events/file-ready/file-ready.extension.ts';

import fileFailed from './extensions/backend/events/file-failed/file-failed.extension.ts';

export default app()
  .use(myPage).use(dataCollections).use(submissionCreated).use(submissionUpdated).use(formsPdfTools).use(pdfToolsProvider).use(fileReady).use(fileFailed);
