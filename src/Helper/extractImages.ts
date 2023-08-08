export const extractImagesFromMessage = (message: string) => {
  const imgPattern = /<img.*?src=["'](.*?)["'].*?>/g;
  const images = message.match(imgPattern);
  return images || [];
};

export const renderImagesInMessage = (message: string) => {
  const imgPattern = /<img.*?src=["'](.*?)["'].*?>/g;
  const images = message.match(imgPattern);
  
  if (images) {
    const extractedImages = images.map(imgTag => ({
      isImage: true,
      content: imgTag
    }));
    return extractedImages;
  }

  return [{ isImage: false, content: message }];
};






