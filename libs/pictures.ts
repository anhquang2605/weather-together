export const getImageDimensions = (blob:Blob): Promise<{ width: number, height: number }>  => {
    return new Promise((resolve, reject) => {
      console.log(blob);
      const url = URL.createObjectURL(blob);
      const img = new Image();
      console.log("url",url);
      img.src = url;
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        URL.revokeObjectURL(img.src); // Clean up memory by releasing object URL
        resolve({ width, height });
        console.log("width",width);
      };
  
/*       img.onerror = (err,source,lineno,colno,error) => {
        console.log(err,source,lineno,colno,error);
        reject(new Error("Failed to load image from blob"));
      }; */
  

    });
  }

export const getBlob = async (url:string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob;
}