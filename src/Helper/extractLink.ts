export const extractLinkFromMessage = (message: string) => {
    // Regular expression pattern to find URLs
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const link: RegExpMatchArray | null  = message.match(urlPattern);

return link;
}

export const getMessageWithLinkAsHTML = (message: string) => {
    const link: any  = extractLinkFromMessage(message);
    if (link) {
      const replacedMessage = message.replace(
        link,
        `<a class="message-link" href="${link}" target="blank" nofollow>${link}</a>`
      );
      return { __html: replacedMessage };
    } else {
      return { __html: message };
    }
  };