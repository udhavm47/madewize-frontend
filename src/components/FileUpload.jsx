import { useState } from 'react';
import { authAPI } from '../services/api';

const FileUpload = ({ 
  selectedFiles, 
  setSelectedFiles, 
  uploadedImages = [], 
  onImagesUpdate, 
  maxFiles = 5,
  accept = "image/*",
  className = "",
  disabled = false,
  variant = "light", // "light" or "dark"
  requireAuth = true, // Whether to require authentication for uploads
  showUploadButton = true // Whether to show the upload button
}) => {
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const totalFiles = selectedFiles.length + files.length;
    
    if (totalFiles > maxFiles) {
      setMessage(`❌ Maximum ${maxFiles} files allowed`);
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    // Check file types
    const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      setMessage('❌ Please select only image files');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    // Check file sizes (max 5MB per file)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setMessage('❌ File size must be less than 5MB');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setSelectedFiles(prev => [...prev, ...files]);
    setMessage('');
    
    // If no upload button is shown and no auth is required, automatically process files
    if (!showUploadButton && !requireAuth) {
      handleFileUpload();
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = async () => {
    if (selectedFiles.length === 0) {
      return;
    }

    // Only check for token if authentication is required
    if (requireAuth) {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setMessage('❌ Please login first to upload files.');
        setTimeout(() => setMessage(''), 3000);
        return;
      }
    }

    setUploadingFiles(true);
    setMessage(''); // Clear any existing messages
    
    try {
      if (requireAuth) {
        // Upload to backend for authenticated users
        const formData = new FormData();
        selectedFiles.forEach(file => {
          formData.append('plantImages', file);
        });

        const response = await authAPI.uploadFiles(formData);
        
        if (response.data.success) {
          const uploadedUrls = response.data.data.plantImages;
          
          try {
            // Convert URLs to objects if needed
            const newImageObjects = uploadedUrls.map(url => 
              typeof url === 'string' ? {
                url: url,
                publicId: url.split('/').pop().split('.')[0],
                uploadedAt: new Date()
              } : url
            );
            
            const updatedImages = [...uploadedImages, ...newImageObjects];
            
            // Update parent component
            if (onImagesUpdate) {
              onImagesUpdate(updatedImages);
            }
            
            // Clear selected files
            setSelectedFiles([]);
            
            setMessage('✅ Files uploaded successfully!');
            setUploadSuccess(true);
            setTimeout(() => {
              setMessage('');
              setUploadSuccess(false);
            }, 4000);
            
          } catch (updateError) {
            setMessage('✅ Files uploaded successfully, but there was an error updating the form. Please refresh the page.');
            setTimeout(() => setMessage(''), 5000);
          }
        } else {
          setMessage(`❌ Upload failed: ${response.data.message}`);
          setTimeout(() => setMessage(''), 5000);
        }
      } else {
        // For registration form, just store files locally
        // Convert files to preview URLs and store them
        const fileUrls = selectedFiles.map(file => URL.createObjectURL(file));
        
        // Create mock image objects for the form data
        const mockImages = selectedFiles.map((file, index) => ({
          url: fileUrls[index],
          publicId: `temp_${Date.now()}_${index}`,
          uploadedAt: new Date().toISOString(),
          file: file // Store the actual file for later upload
        }));
        
        // Update the uploaded images list
        if (onImagesUpdate) {
          onImagesUpdate([...uploadedImages, ...mockImages]);
        }
        
        // Clear selected files
        setSelectedFiles([]);
        setUploadSuccess(true);
        setMessage('✅ Files selected successfully! They will be uploaded after registration.');
        
        // Reset success state after 3 seconds
        setTimeout(() => {
          setUploadSuccess(false);
          setMessage('');
        }, 3000);
      }
    } catch (error) {
      setMessage('❌ Upload failed. Please try again.');
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setUploadingFiles(false);
    }
  };

  const removeUploadedImage = (index) => {
    const updatedImages = uploadedImages.filter((_, i) => i !== index);
    if (onImagesUpdate) {
      onImagesUpdate(updatedImages);
    }
  };

  return (
    <div className={`w-full space-y-4 ${className}`} style={{ width: '100%' }}>
      {/* Professional Drag & Drop Upload Area */}
      <div className={`w-full border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        variant === 'dark' 
          ? uploadSuccess
            ? 'border-green-400 bg-green-900/20'
            : uploadedImages.length === 0 && selectedFiles.length === 0
              ? 'border-red-400 bg-red-900/20 hover:border-red-500' 
              : 'border-gray-600 hover:border-gray-500'
          : uploadSuccess
            ? 'border-green-400 bg-green-50'
            : uploadedImages.length === 0 && selectedFiles.length === 0
              ? 'border-red-400 bg-red-50 hover:border-red-500' 
              : 'border-gray-300 hover:border-gray-400'
      }`} style={{ width: '100%' }}>
        <input
          type="file"
          multiple
          accept={accept}
          onChange={handleFileSelect}
          disabled={disabled || uploadingFiles}
          className="hidden"
          id="fileUpload"
        />
        <label
          htmlFor="fileUpload"
          className="cursor-pointer flex flex-col items-center space-y-2"
        >
          {uploadSuccess ? (
            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          )}
          <div className={`text-sm ${variant === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {uploadSuccess ? (
              <span className="font-medium text-green-600">Upload successful!</span>
            ) : (
              <span className={`font-medium ${variant === 'dark' ? 'text-white hover:text-gray-200' : 'text-blue-600 hover:text-blue-500'}`}>Click to upload</span>
            )}
            {!uploadSuccess && ' or drag and drop'}
          </div>
          <p className={`text-xs ${variant === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Images up to 5MB each (max {maxFiles} files)</p>
        </label>
        
        {selectedFiles.length > 0 && (
          <div className="mt-4 w-full">
            <p className={`text-sm mb-2 ${variant === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Selected files:</p>
            <ul className={`text-sm w-full ${variant === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {selectedFiles.map((file, index) => (
                <li key={index} className="flex items-center justify-between py-1">
                  <span>{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700 text-xs"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            {showUploadButton && (
              <button
                type="button"
                onClick={handleFileUpload}
                disabled={uploadingFiles || disabled}
                className="mt-2 w-full px-6 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center justify-center space-x-2 shadow-md"
              >
                {uploadingFiles ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Uploading to Cloudinary...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span>Upload Files</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>


      {/* Uploaded Images Preview */}
      {uploadedImages.length > 0 && (
        <div className="mt-4 w-full">
          <p className={`text-sm mb-2 ${variant === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Uploaded images ({uploadedImages.length}):
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {uploadedImages.map((image, index) => {
              const imageUrl = typeof image === 'string' ? image : image.url;
              return (
                <div key={index} className="relative group">
                  <img
                    src={imageUrl}
                    alt={`Plant image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border"
                    onError={(e) => console.error(`Image ${index} failed to load:`, e)}
                  />
                  <button
                    type="button"
                    onClick={() => removeUploadedImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Message Display */}
      {message && (
        <div className={`p-3 rounded-lg text-sm ${
          message.includes('✅') 
            ? 'bg-green-100 text-green-700 border border-green-200' 
            : 'bg-red-100 text-red-700 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      {/* Success Indicator */}
      {uploadSuccess && (
        <div className="flex items-center space-x-2 text-green-600 text-sm">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Files uploaded successfully!</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
