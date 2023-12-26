export const getImageDimensions = (blob:Blob): Promise<{ width: number, height: number }>  => {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      console.log(img);
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        URL.revokeObjectURL(img.src); // Clean up memory by releasing object URL
        resolve({ width, height });
      };
  
      img.onerror = (err,source,lineno,colno,error) => {
        console.log(err);
        reject(new Error("Failed to load image from blob"));
      };
  
      img.src = url;
    });
  }