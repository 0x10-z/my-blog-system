import fs from 'fs'
import { glob } from 'glob'
import sharp from 'sharp'
import { replaceInFile } from 'replace-in-file'

const imagesDirectory = 'public/static/images/uploads'

// Ruta al directorio que contiene los archivos de texto
const textFilesDirectory = 'data/blog'

// Función para buscar y convertir imágenes a WebP
async function convertImagesToWebP() {
  const convertedImages = []

  try {
    // Buscar todas las imágenes en el directorio y subdirectorios
    const imageFiles = await glob.sync('**/*.{png,jpg,jpeg}', { cwd: imagesDirectory })

    for (const imageFile of imageFiles) {
      // Ruta completa de la imagen original
      const imagePath = `${imagesDirectory}/${imageFile}`

      // Ruta de salida para la imagen WebP
      const webPPath = imagePath.replace(/\.(png|jpg|jpeg)$/i, '.webp')

      // Convertir la imagen a WebP
      await sharp(imagePath).toFile(webPPath)
      fs.unlinkSync(imagePath)
      convertedImages.push({
        original: `/static/images/uploads/${imageFile}`,
        webp: webPPath.replaceAll('public', ''),
      })
      console.log(`Imagen convertida a WebP: ${imagePath} -> ${webPPath}`)
    }

    return convertedImages
  } catch (error) {
    console.error('Error al convertir imágenes a WebP:', error)
  }
}

// Función para reemplazar referencias en archivos de texto
async function replaceImageReferences(convertedImages) {
  try {
    // Buscar archivos de texto en el directorio
    const textFiles = await glob.sync('**/*.mdx', { cwd: textFilesDirectory })
    let numberOfReplacements = 0
    for (const textFile of textFiles) {
      // Ruta completa del archivo de texto
      const filePath = `${textFilesDirectory}/${textFile}`

      // Configuración para reemplazar referencias
      for (const image of convertedImages) {
        //console.log(image)
        const options = {
          files: filePath,
          from: new RegExp(image.original, 'g'),
          to: image.webp,
        }

        const results = await replaceInFile(options)

        if (results && results.length > 0 && results[0].hasChanged) {
          numberOfReplacements++
          console.log(`Referencias reemplazadas en: ${filePath}`)
        }
      }
    }
    console.log(`${numberOfReplacements} ocurrencias reemplazadas.`)
  } catch (error) {
    console.error('Error al reemplazar referencias en archivos de texto:', error)
  }
}

const convertedImages = await convertImagesToWebP()
await replaceImageReferences(convertedImages)
