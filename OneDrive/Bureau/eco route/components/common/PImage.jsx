import React from 'react';

const ProfileImage = ({ imageUrl }) => {
  console.log(imageUrl);
 
  return (
    <div className='image-container center'>
      {imageUrl ? (
        <div
          className='circle'
          style={{
            backgroundImage: `url(${imageUrl})`,
          }}
        ></div>
      ) : (
        <div className='circle-placeholder'>No Image</div>
      )}
    </div>
  );
};

export default ProfileImage;
