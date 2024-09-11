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
  const [isModalOpen, setIsModalOpen] = useState(false) // State for modal visibility

  useEffect(() => {
    const fetchScripts = async () => {
      try {
        const response = await fetch('/api/scraper') // Llamada a la API
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

  // Function to get unique scripts by name and url
  const getUniqueScripts = () => {
    const uniqueScripts = new Map()

    scripts.forEach((script) => {
      if (script.url && !uniqueScripts.has(script.url)) {
        uniqueScripts.set(script.url, script)
      }
    })

    return Array.from(uniqueScripts.values())
  }

  // Modal toggle functions
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <div className="container mx-auto flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-900">Nmap Scripts Helper</h1>

        <div className="mb-4 flex items-center justify-center gap-2">
          <p className="text-center text-lg font-medium text-gray-700">
            Total scripts loaded: {scripts.length}
          </p>
          {/* Info button to open modal */}
          <button onClick={openModal}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600 dark:text-gray-300"
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
          placeholder="Search for an Nmap script..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-6 w-full rounded-lg border border-gray-300 p-3 text-lg focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
        />

        <div className="relative mb-6 rounded-lg bg-gray-900 p-5 font-mono text-lg text-green-400 shadow-lg">
          <p>nmap --script {selectedScript ? selectedScript.name : '<select script>'} [target]</p>
          <button
            onClick={handleCopy}
            className="absolute right-2 top-2 rounded bg-gray-700 px-2 py-1 text-white hover:bg-gray-600 focus:outline-none focus:ring focus:ring-green-300"
          >
            Copy
          </button>
          <ToastContainer />
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="mx-auto max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">NSE Scripts Source</h2>

              <a
                href="https://nmap.org/nsedoc/scripts/"
                target="_blank"
                rel="noopener noreferrer"
                className="mb-4 block text-lg text-blue-500 hover:underline"
              >
                https://nmap.org/nsedoc/scripts/
              </a>

              <p className="mb-6 text-gray-700">
                Here are 3rd party Nmap scripts and their repository URLs:
              </p>

              <ul className="mb-6 space-y-2 text-left text-gray-700">
                {getUniqueScripts().map((script, index) => (
                  <li key={index} className="mb-2 rounded-lg bg-gray-100 p-3 shadow-sm">
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
                className="mt-4 w-full rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <ul className="h-96 w-full space-y-4 overflow-y-auto rounded-lg border border-gray-200 p-2">
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
