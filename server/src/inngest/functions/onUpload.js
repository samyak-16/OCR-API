import { inngest } from '../../Config/inngest.js';
import { Page } from '../../Models/page.model.js';
import { extractNepaliText } from '../../Services/ai.services.js';

import { saveAsTxt } from '../../Utils/saveAsTxt.js';

const onUpolad = inngest.createFunction(
  {
    id: 'on-upload',
    retries: 0,
  },
  { event: 'on/upload' },
  async ({ event, step }) => {
    try {
      const pages = await step.run('fetch-all-page-doc', async () => {
        return await Page.find();
      });
      await step.run(
        'extract-metadata-from-originalFileName-and-save',
        async () => {
          for (const page of pages) {
            const bookIdentifier = page.originalName.split('-')[0];
            const pageOrder = parseInt(
              page.originalName.split('-')[1].split('.')[0]
            );
            await Page.findByIdAndUpdate(page._id.toString(), {
              bookIdentifier,
              pageOrder,
            });
          }
        }
      );

      await step.run('extract-nepali-text-from-image', async () => {
        for (const page of pages) {
          const translatedText = await extractNepaliText({
            filePath: page.localPath,
          });
          await Page.findByIdAndUpdate(page._id.toString(), {
            translatedText,
          });
        }
      });

      await step.run('aggregate-translated-text-into-single-file', async () => {
        const distinctBookIdentifiers = await Page.distinct('bookIdentifier');
        for (const bookIdentifier of distinctBookIdentifiers) {
          const pages = await Page.find({ bookIdentifier }).sort({
            pageOrder: 1,
          });

          const aggregatedText = pages
            .map((page) => page.translatedText)
            .join('\n \n');
          await saveAsTxt({
            fileName: bookIdentifier,
            fileContent: aggregatedText,
          });
        }
      });
      return { success: true };
    } catch (error) {
      console.error('❌ Error running Steps :', error.message);
    }
  }
);

export { onUpolad };
