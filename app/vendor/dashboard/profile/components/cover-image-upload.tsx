'use client';

import { useState } from 'react';
import { UploadButton } from '@/app/lib/uploadthing';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Camera, ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface CoverImageUploadProps {
  initialImage?: string | null;
  userId: string; // User ID required for API actions
  vendorId?: string; // Vendor ID (required for store image)
  formAction: string; // API endpoint path
  imageType: 'profile' | 'store'; // Type of image being uploaded
  onImageUpdate?: (url: string) => void; // Callback when image is updated
}

export default function CoverImageUpload({ 
  initialImage, 
  userId, 
  vendorId, 
  formAction, 
  imageType,
  onImageUpdate
}: CoverImageUploadProps) {
  const [image, setImage] = useState<string | null>(initialImage || null);
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="w-full">
      <div className="relative w-full h-48 overflow-hidden rounded-lg border-2 border-dashed border-agricultural-200 dark:border-agricultural-700/50 bg-agricultural-50 dark:bg-zinc-800/50 flex flex-col items-center justify-center">
        {image ? (
          <>
            <Image 
              src={image} 
              alt="Store Cover" 
              layout="fill"
              className="object-cover absolute inset-0"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <div className="p-2 bg-white dark:bg-zinc-800 rounded-full">
                {!isUploading && (
                  <div className="relative">
                    <UploadButton
                      // @ts-ignore - storeCover endpoint is defined in the uploadthing router
                      endpoint="storeCover"
                      onClientUploadComplete={async (res) => {
                        if (res && res[0]) {
                          const imageUrl = res[0].url;
                          setImage(imageUrl);
                          
                          // Call the onImageUpdate callback if provided
                          if (onImageUpdate) {
                            onImageUpdate(imageUrl);
                          }
                          
                          // If there's a form action URL provided, call it using fetch
                          if (formAction && userId) {
                            try {
                              const payload = {
                                userId,
                                imageUrl,
                                imageType
                              };
                              
                              // Add vendorId for store image updates
                              if (imageType === 'store' && vendorId) {
                                Object.assign(payload, { vendorId });
                              }
                              
                              const response = await fetch(formAction, {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(payload),
                              });
                              
                              if (!response.ok) {
                                throw new Error('Server response was not ok');
                              }
                            } catch (error) {
                              console.error('Failed to save image URL to server', error);
                              toast.error('Failed to update store cover image on server');
                            }
                          }
                          
                          toast.success('Store cover image updated');
                        }
                        setIsUploading(false);
                      }}
                      onUploadError={(error: Error) => {
                        toast.error(`Error: ${error.message}`);
                        setIsUploading(false);
                      }}
                      onUploadBegin={() => {
                        setIsUploading(true);
                      }}
                      appearance={{
                        button: {
                          background: 'var(--upload-button-bg, white)',
                          border: '1px solid var(--upload-button-border, #e2e8f0)',
                          borderRadius: '9999px',
                          padding: '0.5rem',
                          color: 'var(--upload-button-text, inherit)'
                        }
                      }}
                      className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-agricultural-300 dark:[--upload-button-bg:theme(colors.zinc.800)] dark:[--upload-button-border:theme(colors.zinc.700)] dark:[--upload-button-text:theme(colors.agricultural.300)]"
                    />
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <Camera className="h-4 w-4" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            {isUploading ? (
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="h-8 w-8 border-2 border-agricultural-600 dark:border-agricultural-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-agricultural-600 dark:text-agricultural-400">Uploading...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="p-2 bg-agricultural-100 dark:bg-agricultural-900/30 rounded-full">
                  <ImageIcon className="h-6 w-6 text-agricultural-500 dark:text-agricultural-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-agricultural-800 dark:text-agricultural-300">Upload a store cover image</p>
                  <p className="text-xs text-agricultural-500 dark:text-agricultural-400/80 mt-1">Recommended size: 1200×300</p>
                </div>
                <UploadButton
                  // @ts-ignore - storeCover endpoint is defined in the uploadthing router
                  endpoint="storeCover"
                  className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-agricultural-300 dark:[--upload-button-bg:theme(colors.zinc.800)] dark:[--upload-button-border:theme(colors.zinc.700)] dark:[--upload-button-text:theme(colors.agricultural.300)]"
                  onClientUploadComplete={async (res) => {
                    if (res && res[0]) {
                      setImage(res[0].url);
                      
                      // If there's a form action URL provided, call it using fetch
                      if (formAction && userId) {
                        try {
                          const payload = {
                            userId,
                            imageUrl: res[0].url,
                            imageType
                          };
                          
                          // Add vendorId for store image updates
                          if (imageType === 'store' && vendorId) {
                            Object.assign(payload, { vendorId });
                          }
                          
                          const response = await fetch(formAction, {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(payload),
                          });
                          
                          if (!response.ok) {
                            throw new Error('Server response was not ok');
                          }
                        } catch (error) {
                          console.error('Failed to save image URL to server', error);
                          toast.error('Failed to update store cover image on server');
                        }
                      }
                      
                      toast.success('Store cover image updated');
                    }
                    setIsUploading(false);
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(`Error: ${error.message}`);
                    setIsUploading(false);
                  }}
                  onUploadBegin={() => {
                    setIsUploading(true);
                  }}
                  appearance={{
                    button: {
                      background: '#16a34a',
                      color: 'white',
                      padding: '0.5rem 1rem',
                    }
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
