module.exports =  `
type ImageSizes {
    small: String
    medium: String
    large: String
}

type Image {
    alt: String
    sizes: ImageSizes
}
`