import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'
import fs from 'fs'
import path from 'path'

const jsonFilePath = path.resolve('nmap_scripts.json')

// Lista de repositorios
const GIT_REPOS = [
  {
    name: 'NMAP official repo',
    url: 'https://github.com/nmap/nmap',
  },
  {
    name: 'Paulino Calderon and Fabian Affolter',
    url: 'https://github.com/cldrn/nmap-nse-scripts',
  },
]

// Obtén el token de GitHub de las variables de entorno
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '<put github token here>'

// Función que construye la apiUrl
function constructGitApiUrl(gitUrl: string, path = '') {
  const pathParts = gitUrl.split('github.com/')[1]
  return `https://api.github.com/repos/${pathParts}/contents${path ? `/${path}` : ''}`
}

// Función que comprueba si el archivo existe y su antigüedad
function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath)
}

// Función recursiva para obtener todos los archivos .nse de un repositorio de GitHub mediante la API
async function scrapeGitRepoScriptsRecursively(apiUrl: string, repoUrl: string) {
  const scripts: { name: string; description: string }[] = []

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`, // Agregar token en la cabecera
      },
    })

    const data = await response.json()
    for (const file of data) {
      if (file.type === 'dir') {
        // Si el archivo es un directorio, hacer una llamada recursiva
        const subDirScripts = await scrapeGitRepoScriptsRecursively(file.url, repoUrl)
        scripts.push(...subDirScripts)
      } else if (file.type === 'file' && file.name.endsWith('.nse')) {
        // Si el archivo es un script .nse, obtener su contenido
        const fileContent = await fetch(file.download_url, {
          headers: {
            Authorization: `token ${GITHUB_TOKEN}`, // Agregar token en la cabecera
          },
        })
        const scriptContent = await fileContent.text()
        const description = extractScriptDescription(scriptContent)

        scripts.push({
          name: file.name,
          description: description || 'No description available',
        })
      }
    }
  } catch (error) {
    console.error(`Error fetching data from repo ${apiUrl}:`, error)
  }

  return scripts
}

// Función auxiliar para extraer la descripción de un script .nse
function extractScriptDescription(content: string): string | null {
  const descriptionMatch = content.match(/description\s*=\s*\[\[([^\]]+)\]\]/)
  return descriptionMatch ? descriptionMatch[1].trim() : null
}

// Función para hacer scraping de la página de Nmap
async function scrapeNmapScripts() {
  const url = 'https://nmap.org/nsedoc/scripts/'

  try {
    const response = await fetch(url)
    const html = await response.text()
    const $ = cheerio.load(html)
    const scripts: { name: string; description: string; source: string }[] = []

    $('dt').each((i, el) => {
      const scriptName = $(el).find('a').text().trim()
      const description = $(el).next('dd').find('p').text().trim()

      scripts.push({
        name: scriptName,
        description: description,
        source: 'Nmap',
      })
    })

    fs.writeFileSync(jsonFilePath, JSON.stringify(scripts, null, 2), 'utf-8')

    return scripts
  } catch (error) {
    console.error('Error during scraping Nmap scripts:', error)
    return []
  }
}

// Función para hacer scraping de los repositorios externos
async function scrapeExternalScripts() {
  const allExternalScripts: { name: string; description: string; source: string; url?: string }[] =
    []

  for (const repo of GIT_REPOS) {
    const repoFilePath = path.resolve(
      `${repo.name.replace(/\s+/g, '_').toLowerCase()}_scripts.json`
    )
    let externalScripts: { name: string; description: string; source: string; url?: string }[] = []

    // Comprobar si el archivo ya existe y es reciente
    if (!fileExists(repoFilePath)) {
      console.log(`Iniciando descarga de scripts del repositorio: ${repo.name} (${repo.url})`)

      try {
        const apiUrl = constructGitApiUrl(repo.url)
        const gitScripts = await scrapeGitRepoScriptsRecursively(apiUrl, repo.url)
        gitScripts.forEach((script) => {
          externalScripts.push({
            name: script.name,
            description: script.description,
            source: 'External',
            url: repo.url,
          })
        })

        // Guardar los datos en un archivo JSON específico para cada repo
        fs.writeFileSync(repoFilePath, JSON.stringify(externalScripts, null, 2), 'utf-8')

        console.log(`Finalizada la iteración de scripts del repositorio: ${repo.name}`)
      } catch (error) {
        console.error(`Error during scraping external scripts for ${repo.name}:`, error)
      }
    } else {
      console.log(`Los scripts del repositorio ${repo.name} ya están actualizados.`)
      const fileData = fs.readFileSync(repoFilePath, 'utf-8')
      externalScripts = JSON.parse(fileData)
    }

    allExternalScripts.push(...externalScripts)
  }

  return allExternalScripts
}

// API Route (GET)
export async function GET() {
  let nmapScripts: { name: string; description: string; source: string }[] = []

  // Verificar si los scripts de Nmap son recientes
  if (!fileExists(jsonFilePath)) {
    nmapScripts = await scrapeNmapScripts()
  } else {
    const fileData = fs.readFileSync(jsonFilePath, 'utf-8')
    nmapScripts = JSON.parse(fileData)
    console.log('Los scripts de Nmap ya están actualizados.')
  }

  // Obtener los scripts de los repositorios externos
  const externalScripts = await scrapeExternalScripts()

  // Combinar todos los scripts (Nmap y externos)
  const allScripts = [...nmapScripts, ...externalScripts]

  // Devolver el JSON de todos los scripts combinados
  return NextResponse.json(allScripts)
}
