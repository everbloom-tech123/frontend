import React from 'react';

const MediaUpload = ({ 
  handleFileChange, 
  handleRemoveImage,
  handleRemoveVideo,
  imageError, 
  videoError,
  previewUrls,
  formData,
  isEditing
}) => {
  // Helper function to determine if an image is from existing images
  const isExistingImage = (index) => {
    const existingImagesCount = formData.imageUrls?.length || 0;
    return index < existingImagesCount;
  };

  return (
    <div className="space-y-6">
      {/* Image Upload Section */}
      <div>
        <h3 className="text-lg font-medium mb-2">Images (Maximum 5)</h3>
        <input
          type="file"
          name="images"
          onChange={handleFileChange}
          multiple
          accept="image/*"
          className="mb-2"
        />
        {imageError && (
          <div className="text-red-500 mb-2">{imageError}</div>
        )}
        <div className="flex gap-2 flex-wrap">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-24 h-24 object-cover rounded"
              />
              <button
                type="button"
                className="absolute top-0 right-0 bg-white rounded-full p-1 shadow-md"
                onClick={() => handleRemoveImage(index, isExistingImage(index))}
              >
                <span className="sr-only">Remove image</span>
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Video Upload Section */}
      <div>
        <h3 className="text-lg font-medium mb-2">Video</h3>
        <input
          type="file"
          name="video"
          onChange={handleFileChange}
          accept="video/*"
          className="mb-2"
        />
        {videoError && (
          <div className="text-red-500 mb-2">{videoError}</div>
        )}
        {(formData.video || formData.videoUrl) && (
          <div className="flex items-center gap-2">
            <span className="text-sm">
              {formData.video ? formData.video.name : 'Current video'}
            </span>
            <button
              type="button"
              className="text-red-500 text-sm"
              onClick={handleRemoveVideo}
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaUpload;