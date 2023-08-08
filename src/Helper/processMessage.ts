import { renderImagesInMessage } from "./extractImages";
import { extractLinkFromMessage } from "./extractLink";

export const processMessageContent = (message: string) => {
  const imgPattern = /<img.*?src=["'](.*?)["'].*?>/g;
  const urlPattern = /(?<!['"=])(https?:\/\/[^\s]+)/g;

  const images = message.match(imgPattern);
  const link = extractLinkFromMessage(message);

  if (images || link) {
    const processedContent = message.replace(imgPattern, (imgTag) => {
      return renderImagesInMessage(imgTag)[0].content;
    });

    const replacedMessage = processedContent.replace(
      urlPattern,
      (match) =>
        `<a class="message-link" href="${match}" target="_blank" rel="nofollow">${match}</a>`
    );

    return replacedMessage;
  }

  return message;
};
