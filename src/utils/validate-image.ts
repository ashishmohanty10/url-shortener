export const validateImage = (file: File) => {
  if (!file) return 'Please select an image'
  if (!file.type.startsWith('image/')) return 'Only image files are allowed'
  if (file.size > 1 * 1024 * 1024) return 'File size must be less than 1MB'
  return true
}
