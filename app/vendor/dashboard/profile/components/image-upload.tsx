'use client';

import { useState } from 'react';
import { UploadButton } from '@/app/lib/uploadthing';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';

interface ImageUploadProps {
  initialImage?: string | null;
  userId: string; // User ID required for API actions
  name: string;
  formAction: string; // API endpoint path
  imageType: 'profile' | 'store'; // Type of image being uploaded
  vendorId?: string; // Vendor ID (required for store image)
  label?: string; // Optional custom label
}

export default function ImageUpload({ initialImage, userId, name, formAction, imageType, vendorId, label }: ImageUploadProps) {
  const [image, setImage] = useState<string | null>(initialImage || null);
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="flex flex-col items-center mb-4">
      {label && <div className="text-sm font-medium mb-2">{label}</div>}
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={image || ''} alt={name} />
          <AvatarFallback className="bg-agricultural-100 text-agricultural-700 text-2xl">
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-2 -right-2">
          {isUploading ? (
            <div className="h-8 w-8 rounded-full bg-white border flex items-center justify-center">
              <div className="h-4 w-4 border-2 border-agricultural-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="relative">
              <UploadButton
                endpoint="profileImage"
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
                        toast.error('Failed to update profile image on server');
                      }
                    }
                    
                    toast.success(imageType === 'profile' ? 'Profile image updated' : 'Store image updated');
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
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '9999px',
                    padding: '0',
                    width: '2rem',
                    height: '2rem'
                  }
                }}
              />
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <Camera className="h-4 w-4" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
