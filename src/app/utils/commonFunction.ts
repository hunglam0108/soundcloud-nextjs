import slugify from "slugify"

export const convertSlugUrl = (str: string) => {
  if(!str) {
    return ""
  }
  str = slugify(str, { lower:true, locale: 'vi'})
  return str
}

export const reduceText = (fileName: string) => {
    return fileName.length > 30 ? fileName.slice(0, 30) + "..." : fileName;
  }