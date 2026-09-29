import { files } from '@wix/media';
import { processMediaReady } from '../../../../lib/forms-pdf/service';

export default files.onFileDescriptorFileReady(async (event) => {
  await processMediaReady(event);
});
