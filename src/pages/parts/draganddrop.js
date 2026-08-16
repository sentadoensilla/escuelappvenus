import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

export const useDragAndDrop = () => {
  const [images, setImages] = useState([]);
  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      setImages(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const imageList = images.map((image) => (
    <div key={image.name}>
      <img src={image.preview} alt="file" className="uploaded-img" />
    </div>
  ));

  useEffect(() => {
    return () => images.forEach((image) => URL.revokeObjectURL(image.preview));
  }, []);

  const resetImage = () => {
    setImages([]);
  };

  return {
    getRootProps,
    getInputProps,
    open,
    imageList,
    resetImage,
  };
};