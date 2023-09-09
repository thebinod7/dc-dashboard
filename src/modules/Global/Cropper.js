import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import React from "react";
import PropTypes from "prop-types";

export default function Cropper({
  onImageLoaded,
  onCropComplete,
  handleChangeCrop,
  src,
  crop,
}) {
  const minH = 200;
  const minW = 400;
  return (
    <div>
      <ReactCrop
        minHeight={minH}
        minWidth={minW}
        maxHeight={minH + 40}
        maxWidth={minW + 60}
        src={src}
        crop={crop}
        onChange={handleChangeCrop}
        onComplete={onCropComplete}
        onImageLoaded={onImageLoaded}
      />
    </div>
  );
}

Cropper.propTypes = {
  handleChangeCrop: PropTypes.func.isRequired,
  onCropComplete: PropTypes.func.isRequired,
  onImageLoaded: PropTypes.func.isRequired,
  src: PropTypes.string.isRequired,
  crop: PropTypes.object.isRequired,
};
