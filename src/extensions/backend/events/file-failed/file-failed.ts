import { files } from '@wix/media';
import { processMediaFailed } from '../../../../lib/forms-pdf/service';

export default files.onFileDescriptorFileFailed(async (event) => {
  await processMediaFailed(event);
});
