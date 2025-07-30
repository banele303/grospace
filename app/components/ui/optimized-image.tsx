"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends Omit<ImageProps, 'onError' | 'onLoad'> {
  fallbackSrc?: string;
  showFallbackOnError?: boolean;
  containerClassName?: string;
}

export function OptimizedImage({
  src,
  alt,
  className,
  containerClassName,
  fallbackSrc = "/placeholder-image.jpg",
  showFallbackOnError = true,
  quality = 85,
  placeholder = "blur",
  blurDataURL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=",
  ...props
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    if (showFallbackOnError && fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      <Image
        {...props}
        src={imageSrc}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          hasError && "grayscale",
          className
        )}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onError={handleError}
        onLoad={handleLoad}
        sizes={props.sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
      />
      
      {hasError && !fallbackSrc && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm font-medium">Image unavailable</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Preset configurations for common use cases
export const ProductImage = (props: OptimizedImageProps) => (
  <OptimizedImage
    {...props}
    quality={90}
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
    className={cn("object-cover", props.className)}
  />
);

export const HeroImage = (props: OptimizedImageProps) => (
  <OptimizedImage
    {...props}
    priority
    quality={95}
    sizes="100vw"
    className={cn("object-cover", props.className)}
  />
);

export const ThumbnailImage = (props: OptimizedImageProps) => (
  <OptimizedImage
    {...props}
    quality={75}
    sizes="(max-width: 768px) 50px, 100px"
    className={cn("object-cover", props.className)}
  />
);

export const LogoImage = (props: OptimizedImageProps) => (
  <OptimizedImage
    {...props}
    priority
    quality={90}
    sizes="(max-width: 768px) 120px, 150px"
    className={cn("object-contain", props.className)}
  />
);
