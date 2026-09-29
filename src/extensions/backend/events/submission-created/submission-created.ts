import { submissions } from '@wix/forms';
import { processSubmissionEvent } from '../../../../lib/forms-pdf/service';

export default submissions.onSubmissionCreated(async (event) => {
  await processSubmissionEvent(event, 'created');
});
