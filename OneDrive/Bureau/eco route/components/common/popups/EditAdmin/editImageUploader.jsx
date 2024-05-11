import React, { useState, useEffect } from 'react';

const EditImageUploader = ({ imageUrl, handleImageUpload }) => {
  const [previewImage, setPreviewImage] = useState(imageUrl);

  useEffect(() => {
    setPreviewImage(imageUrl);
  }, [imageUrl]);

  const handleChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      handleImageUpload(file);
    }
  };

  return (
    <div className='center'>
      <label htmlFor="profileImage" className="image-placeholder">
        <div className="image-container" style={{ backgroundImage: `url(${previewImage})` }}></div>
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

export default EditImageUploader;
