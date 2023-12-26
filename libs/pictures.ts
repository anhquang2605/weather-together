export const getImageDimensions = (blob:Blob): Promise<{ width: number, height: number }>  => {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.src = url;
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        URL.revokeObjectURL(img.src); // Clean up memory by releasing object URL
        resolve({ width, height });
      };
  
      img.onerror = (err) => {
        reject(new Error("Failed to load image from blob"));
      };
    });
  }

export const getBlob = async (url:string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob;
}
