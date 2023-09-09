const getCroppedImg = (imgRef, crop, fileName) => {
	const canvas = document.createElement('canvas');
	const scaleX = imgRef.naturalWidth / imgRef.width;
	const scaleY = imgRef.naturalHeight / imgRef.height;
	canvas.width = crop.width;
	canvas.height = crop.height;
	const ctx = canvas.getContext('2d');

	ctx.drawImage(
		imgRef,
		crop.x * scaleX,
		crop.y * scaleY,
		crop.width * scaleX,
		crop.height * scaleY,
		0,
		0,
		crop.width,
		crop.height
	);

	let fileUrl = null;

	const reader = new FileReader();
	return new Promise((resolve, reject) => {
		canvas.toBlob(blob => {
			if (!blob) {
				console.error('Canvas is empty');
				return;
			}
			blob.name = fileName;
			window.URL.revokeObjectURL(fileUrl);
			fileUrl = window.URL.createObjectURL(blob);

			reader.readAsDataURL(blob);
			reader.onloadend = () => {
				let _file = dataURLtoFile(reader.result, 'cropped.jpg');
				resolve({ fileUrl: fileUrl, file: _file });
			};
		});
	});
};

const dataURLtoFile = (dataurl, filename) => {
	if (!filename) filename = 'newFile.jpeg';
	// dataurl = blob file url
	let arr = dataurl.split(','),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n);

	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	let _file = new File([u8arr], filename, { type: mime });
	return _file;
};

const fileToBase64 = file =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = error => reject(error);
	});

module.exports = { getCroppedImg, fileToBase64 };
