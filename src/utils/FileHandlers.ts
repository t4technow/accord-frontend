// Function to convert base64string back to file
export const base64ToFile = (fileData: string, fileName: string): File => {
  const byteString = atob(fileData);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  return new File([uint8Array], fileName, {
    type: "application/octet-stream",
  });
};

// Get file type from mime type
export const getFileTypeFromMimeType = (mimeType: string): "image" | "video" | "application" => {
  const typePrefix = mimeType.split("/")[0];
  if (typePrefix === "image") {
    return "image";
  } else if (typePrefix === "video") {
    return "video";
  } else {
    return "application";
  }
};

// Convert a file to Base64 with file name
export const convertFileToBase64 = async (file: File): Promise<{ fileData: string; fileName: string; fileType: "image" | "video" | "application" } | null> => {
  try {
    const base64String = await new Promise<string | ArrayBuffer | null>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Error reading file"));
      reader.readAsDataURL(file);
    });

    if (typeof base64String === "string") {
      const fileType = file.type.split("/")[0];
      if (["image", "video", "application"].includes(fileType)) {
        return {
          fileData: base64String.split(",")[1],
          fileName: file.name,
          fileType: fileType as "image" | "video" | "application",
        };
      } else {
        console.log("Unsupported file type:", fileType);
      }
    } else {
      console.log("Invalid file data:", base64String);
    }
  } catch (error) {
    console.log("Error converting file to Base64:", error);
  }

  return null;
};
