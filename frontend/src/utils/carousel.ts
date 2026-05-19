export interface ImageGallerySource {
  imageUrl?: string | null
  imageUrls?: string[] | null
}

export function resolveImageUrls(source?: ImageGallerySource | null): string[] {
  if (!source) {
    return []
  }

  const galleryImages = source.imageUrls?.filter(Boolean) ?? []
  if (galleryImages.length > 0) {
    return galleryImages
  }

  return source.imageUrl ? [source.imageUrl] : []
}

export function getNextGalleryIndex(currentIndex: number, totalImages: number): number {
  if (totalImages <= 1) {
    return currentIndex
  }

  return currentIndex >= totalImages - 1 ? 0 : currentIndex + 1
}

export function getPreviousGalleryIndex(currentIndex: number, totalImages: number): number {
  if (totalImages <= 1) {
    return currentIndex
  }

  return currentIndex <= 0 ? totalImages - 1 : currentIndex - 1
}
