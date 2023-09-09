const getCroppedImage = (image, crop, fileName) => {
  // let img = new Image();
  // img.src = image;
  //crop.height = 300;
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = Math.ceil(crop.width);
  canvas.height = Math.ceil(crop.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  // As Base64 string
  // const base64Image = canvas.toDataURL('image/jpeg');

  // As a blob
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      let _cropped = null;
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        _cropped = dataURLtoFile(reader.result, "cropped.jpg");
        resolve(_cropped);
      };
      // blob.name = fileName;
    });
  });
};

const dataURLtoFile = (dataurl, filename) => {
  let arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  let croppedImage = new File([u8arr], filename, { type: mime });
  return croppedImage;
};

module.exports = getCroppedImage;
