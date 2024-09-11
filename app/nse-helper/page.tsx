'use client'

import { useState, useEffect, useCallback } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ScriptCard from './ScriptCard'

export default function ScraperPage() {
  const [scripts, setScripts] = useState<
    { name: string; description: string; source?: string; url?: string }[]
  >([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedScript, setSelectedScript] = useState<{
    name: string
    description: string
  } | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchScripts = async () => {
      try {
        const response = await fetch('/api/scraper')
        const data = await response.json()
        setScripts(data)
      } catch (error) {
        console.error('Error fetching scripts:', error)
      }
    }

    fetchScripts()
  }, [])

  const filteredScripts = searchTerm
    ? scripts.filter((script) => script.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : scripts

  const handleScriptSelect = useCallback((script: { name: string; description: string }) => {
    setSelectedScript(script)
  }, [])

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      toast.success('URL copied to clipboard!')
    })
  }

  const handleCopy = () => {
    if (selectedScript) {
      const command = `nmap --script ${selectedScript.name} [target]`
      navigator.clipboard.writeText(command).then(() => {
        toast.success('Command copied to clipboard!')
      })
    }
  }

  const getUniqueScripts = () => {
    const uniqueScripts = new Map()

    scripts.forEach((script) => {
      if (script.url && !uniqueScripts.has(script.url)) {
        uniqueScripts.set(script.url, script)
      }
    })

    return Array.from(uniqueScripts.values())
  }

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <div className="container mx-auto flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg sm:max-w-2xl">
        <h1 className="mb-4 text-center text-2xl font-bold text-gray-900 dark:text-gray-300 sm:text-3xl">
          Nmap Scripts Helper
        </h1>

        <div className="mb-4 flex items-center justify-center gap-2">
          <p className="text-center text-sm font-medium text-gray-700 dark:text-gray-500 sm:text-lg">
            Total scripts: {scripts.length}
          </p>
          <button onClick={openModal}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600 dark:text-gray-300 sm:h-6 sm:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
              />
            </svg>
          </button>
        </div>

        <input
          type="text"
          placeholder="Search scripts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200 sm:p-3 sm:text-lg"
        />

        <div className="relative mb-4 rounded-lg bg-gray-900 p-4 font-mono text-sm text-green-400 shadow-lg sm:p-5 sm:text-lg">
          <p>nmap --script {selectedScript ? selectedScript.name : '<select script>'} [target]</p>
          <button
            onClick={handleCopy}
            className="absolute right-2 top-2 rounded bg-gray-700 px-2 py-1 text-xs text-white hover:bg-gray-600 focus:outline-none focus:ring focus:ring-green-300 sm:text-sm"
          >
            Copy
          </button>
          <ToastContainer />
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="mx-auto max-w-sm rounded-lg bg-white p-6 text-center shadow-lg sm:p-8">
              <h2 className="mb-4 text-lg font-bold text-gray-900 sm:text-2xl">
                NSE Scripts Source
              </h2>

              <a
                href="https://nmap.org/nsedoc/scripts/"
                target="_blank"
                rel="noopener noreferrer"
                className="mb-4 block text-sm text-blue-500 hover:underline sm:text-lg"
              >
                https://nmap.org/nsedoc/scripts/
              </a>

              <p className="mb-4 text-sm text-gray-700 sm:text-lg">
                Here are 3rd party Nmap scripts:
              </p>

              <ul className="mb-4 space-y-2 text-left text-sm text-gray-700 sm:text-lg">
                {getUniqueScripts().map((script, index) => (
                  <li key={index} className="mb-2 rounded-lg bg-gray-100 p-2 shadow-sm sm:p-3">
                    {script.url ? (
                      <a
                        href={script.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {script.url}
                      </a>
                    ) : (
                      <span className="text-red-500">No URL available</span>
                    )}
                  </li>
                ))}
              </ul>

              <button
                onClick={closeModal}
                className="mt-4 w-full rounded-lg bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 sm:px-4 sm:py-2"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <ul className="h-80 w-full space-y-2 overflow-y-auto rounded-lg border border-gray-200 p-2 sm:space-y-4 sm:p-2">
        {filteredScripts.map((script, index) => (
          <li key={index}>
            <ScriptCard
              tabIndex={index}
              script={script}
              handleScriptSelect={handleScriptSelect}
              handleCopyUrl={handleCopyUrl}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
