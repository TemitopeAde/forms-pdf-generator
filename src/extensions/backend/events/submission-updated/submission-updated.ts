import { submissions } from '@wix/forms';
import { processSubmissionEvent } from '../../../../lib/forms-pdf/service';

export default submissions.onSubmissionUpdated(async (event) => {
  await processSubmissionEvent(event, 'updated');
});
