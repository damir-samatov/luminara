import { onGetSignedFileUploadUrl } from "@/actions/file.actions";

export const uploadFile = async (file: File) => {
  try {
    const res = await onGetSignedFileUploadUrl({
      title: file.name,
      type: file.type,
      size: file.size,
    });

    if (!res.success) return null;

    await fetch(res.data.signedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};
