export const extractLinkFromMessage = (message: string) => {
  // Regular expression pattern to find URLs
  const urlPattern = /(?<!['"=])(https?:\/\/[^\s]+)/g;
  const link: RegExpMatchArray | null = message.match(urlPattern);
  return link?.[0] || null; // Get the first link from the array or return null
}

export const getMessageWithLinkAsHTML = (message: string) => {
  const link: string | null = extractLinkFromMessage(message);
  if (link) {
    const replacedMessage = message.replace(
      link,
      (match) =>
        `<a class="message-link" href="${match}" target="_blank" rel="nofollow">${match}</a>`
    );
    return { __html: replacedMessage };
  } else {
    return { __html: message };
  }
};
