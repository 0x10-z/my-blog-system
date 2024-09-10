'use client'
import { useState } from 'react'

const hashRates = {
  MD5: {
    rate: 10000000000, // 10 billion per second
    tooltip: 'MD5: 10 mil millones de hashes por segundo',
  },
  'SHA-1': {
    rate: 1000000000, // 1 billion per second
    tooltip: 'SHA-1: 1 mil millones de hashes por segundo',
  },
  'SHA-256': {
    rate: 100000000, // 100 million per second
    tooltip: 'SHA-256: 100 millones de hashes por segundo',
  },
  bcrypt: {
    rate: 1000, // 1000 per second
    tooltip: 'bcrypt: 1000 hashes por segundo',
  },
  Argon2: {
    rate: 500, // 500 per second
    tooltip: 'Argon2: 500 hashes por segundo',
  },
}

const dictionaries = [
  {
    name: 'rockyou.txt',
    url: 'https://download.weakpass.com/wordlists/90/rockyou.txt.gz',
    description: '(133 MB, 14.3 millones de contraseñas)',
  },
  {
    name: 'SecLists',
    url: 'https://github.com/danielmiessler/SecLists/tree/master',
    description: 'Repositorio Git',
  },
  {
    name: 'Wifi Sploit',
    url: 'https://github.com/kevinadhiguna/wifi-sploit',
    description: 'Wi-Fi sploit para páginas de login de routers',
  },
]

function calculateCombinations(password: string) {
  const charsetSize = 94 // Assuming all printable ASCII characters
  return Math.pow(charsetSize, password.length)
}

function formatTime(seconds: number) {
  const years = Math.floor(seconds / (365 * 24 * 60 * 60))
  const days = Math.floor((seconds % (365 * 24 * 60 * 60)) / (24 * 60 * 60))
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60))
  const minutes = Math.floor((seconds % (60 * 60)) / 60)
  const secs = Math.floor(seconds % 60)

  let result = ''
  if (years > 0) result += `${years} años `
  if (days > 0) result += `${days} días `
  if (hours > 0) result += `${hours} horas `
  if (minutes > 0) result += `${minutes} minutos `
  if (secs > 0) result += `${secs} segundos`

  return result || 'menos de un segundo'
}

export default function Home() {
  const [password, setPassword] = useState('')

  const calculateTime = () => {
    const combinations = calculateCombinations(password)
    return Object.keys(hashRates).map((algorithm) => {
      const hashesPerSecond = hashRates[algorithm as keyof typeof hashRates].rate
      const timeInSeconds = combinations / hashesPerSecond
      const formattedTime = formatTime(timeInSeconds)
      return (
        <p key={algorithm} className="tooltip">
          <span className="tooltip-title">
            {algorithm}
            <span className="tooltip-text absolute rounded-lg bg-gray-800 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100">
              {hashRates[algorithm as keyof typeof hashRates].tooltip}
            </span>
          </span>
          : {formattedTime}
        </p>
      )
    })
  }

  return (
    <div className={`flex items-center justify-center text-black`}>
      <div className="w-full max-w-lg rounded-lg  bg-gray-200 p-8 shadow-lg dark:bg-gray-800 dark:text-white">
        <h1 className="mb-6 text-center text-2xl font-bold">
          Diferencias de Crackeo por Algoritmo
        </h1>
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Ingresa tu contraseña"
          className="mb-6 w-full rounded-lg border border-gray-700 bg-gray-900 p-4 text-white focus:border-green-500 focus:outline-none dark:bg-gray-700"
        />
        <div className="results">
          {password.length === 0 ? (
            <p>Por favor, ingresa una contraseña.</p>
          ) : (
            <>
              <p>Longitud de la contraseña: {password.length} caracteres</p>
              {calculateTime()}
            </>
          )}
        </div>
        <div className="dictionary-list mt-8">
          <h2 className="mb-4 text-xl font-semibold">Diccionarios conocidos de cracking</h2>
          <ul className="space-y-4">
            {dictionaries.map((dict) => (
              <li
                key={dict.name}
                className="flex items-center justify-between rounded-lg bg-gray-700 p-4"
              >
                <a
                  href={dict.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:underline"
                >
                  {dict.name}
                </a>
                <span className="text-gray-400">{dict.description}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
