import React from 'react'

interface ScriptCardProps {
  script: {
    name: string
    description: string
    source?: string
    url?: string
  }
  handleScriptSelect: (script: { name: string; description: string }) => void
  handleCopyUrl: (url: string) => void
}

const ScriptCard: React.FC<ScriptCardProps> = ({ script, handleScriptSelect, handleCopyUrl }) => {
  const isExternal = script.source === 'External'
  const url = script.url || 'https://nmap.org/nsedoc/scripts/'

  return (
    <div
      className={`cursor-pointer rounded-lg border p-4 transition-colors ${
        isExternal ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-100'
      } hover:bg-gray-200`}
      onClick={() => handleScriptSelect(script)}
    >
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">{script.name}</h3>
        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold ${
            isExternal ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
          }`}
        >
          {isExternal ? 'External' : 'Nmap'}
        </span>
      </div>
      <p className="mb-4 text-sm text-gray-700">{script.description}</p>
      <div className="flex items-center justify-end">
        <button
          className="mx-1 text-sm text-blue-500 underline"
          onClick={(e) => {
            e.stopPropagation()
            window.open(url, '_blank')
          }}
        >
          Ver fuente
        </button>
        <button
          className="mx-1 text-sm text-gray-700 underline"
          onClick={(e) => {
            e.stopPropagation()
            handleCopyUrl(url)
          }}
        >
          Copy URL
        </button>
      </div>
    </div>
  )
}

export default ScriptCard
