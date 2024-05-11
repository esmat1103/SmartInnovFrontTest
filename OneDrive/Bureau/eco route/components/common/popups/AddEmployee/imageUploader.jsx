import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import profile from "../../../public/main_content/profile.svg";


const ImageUploader = ({ initialImage, handleImageUpload }) => {

  const [previewImage, setPreviewImage] = useState(initialImage);

  // Effect to update previewImage when initialImage changes
  useEffect(() => {
    setPreviewImage(initialImage);
    console.log('Initial image set:', initialImage);
  }, [initialImage]);


  const handleChange = (event) => {
    const file = event.target.files[0];
    if (file)  {
      // Create object URL for the selected file
      const imageUrl = URL.createObjectURL(file);
      // Update preview image
      setPreviewImage(imageUrl);
      // Call handleImageUpload function passed as props
      handleImageUpload(file);
      console.log('Image changed:', file);
    }
  };

 
  return (
    <div className='center'>
      <label htmlFor="profileImage" className="image-placeholder">
        <div className="image-container">
          {}
          <Image src={previewImage || profile} alt='Uploaded' width={100} height={100} className='center' />

        </div>
        {}
        <input
          type="file"
          id="profileImage"
          name="profileImage"
          accept="image/*"
          onChange={handleChange}
          style={{ display: 'none' }}
        />
      </label>
    </div>
  );
};

export default ImageUploader;