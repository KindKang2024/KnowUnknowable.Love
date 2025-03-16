
export const dataURLtoBlob = (dataURL: string): Blob => {
  const arr = dataURL.split(',');
  if (arr.length < 2) return new Blob();
  
  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch) return new Blob();
  
  const mime = mimeMatch[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new Blob([u8arr], { type: mime });
};
