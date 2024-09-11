import { Github, NMap } from '@/components/social-icons/icons'
import React from 'react'

interface ScriptCardProps {
  tabIndex: number
  script: {
    name: string
    description: string
    source?: string
    url?: string
  }
  handleScriptSelect: (script: { name: string; description: string }) => void
  handleCopyUrl: (url: string) => void
}

const ScriptCard: React.FC<ScriptCardProps> = ({
  tabIndex,
  script,
  handleScriptSelect,
  handleCopyUrl,
}) => {
  const isExternal = script.source === 'External'
  const url = script.url || 'https://nmap.org/nsedoc/scripts/'

  return (
    <div
      role="button"
      tabIndex={tabIndex}
      className={`cursor-pointer rounded-lg border p-4 transition-colors ${
        isExternal ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-100'
      } hover:bg-gray-200`}
      onClick={() => handleScriptSelect(script)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleScriptSelect(script) // Handles keyboard Enter and Space key presses
        }
      }}
    >
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">{script.name}</h3>
        <span
          className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${
            isExternal ? 'bg-gray-200 text-white' : 'bg-gray-500 text-white'
          }`}
        >
          {isExternal ? (
            <div className="flex items-center gap-2 text-gray-800">
              Git
              <Github className="h-4 w-4" />
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-200">
              Nmap
              <NMap className="h-4 w-4" />
            </div>
          )}
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
          Source code
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
