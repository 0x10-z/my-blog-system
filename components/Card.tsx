'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Github } from './social-icons/icons'

interface CardProps {
  title: string
  description: string
  imgSrc?: string
  href?: string | null
  tags?: string[]
  githubUrl?: string | null
}

const Card = ({ title, description, imgSrc, href, tags, githubUrl }: CardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <div className="w-full p-4 md:max-w-[50%]">
      <div
        className={`${imgSrc && 'h-full'} overflow-hidden rounded-md border-2 border-gray-200 border-opacity-60 dark:border-gray-700`}
      >
        {imgSrc && (
          <Image
            alt={title}
            src={imgSrc}
            className="object-cover object-center md:h-36 lg:h-48"
            width={644}
            height={306}
          />
        )}
        <div className="p-6">
          <h2 className="mb-3 text-2xl font-bold leading-8 tracking-tight">{title}</h2>
          <p className="prose mb-3 line-clamp-3 max-w-none text-gray-500 dark:text-gray-400">
            {description}
          </p>
          <div className="mb-4 flex flex-wrap gap-2">
            {tags &&
              tags.slice(0, 3).map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="rounded bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                >
                  {tag}
                </span>
              ))}
            {tags && tags.length > 3 && (
              <span className="rounded bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                +{tags.length - 3} más
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={openModal}
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Leer más
            </button>

            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 transition-colors duration-300 hover:text-gray-900"
              >
                <Github className="h-6 w-6" />
                <span className="sr-only">GitHub Repository</span>
              </a>
            )}

            {href && (
              <Link
                href={href}
                className="text-base font-medium leading-6 text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                aria-label={`Link to ${title}`}
              >
                Ver más &rarr;
              </Link>
            )}
          </div>
        </div>
      </div>
      <ProjectModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={title}
        description={description}
        imgSrc={imgSrc}
        href={href}
        tags={tags}
        githubUrl={githubUrl}
      />
    </div>
  )
}

interface ProjectModalProps extends CardProps {
  isOpen: boolean
  onClose: () => void
}

const ProjectModal = ({
  isOpen,
  onClose,
  title,
  description,
  imgSrc,
  href,
  tags,
  githubUrl,
}: ProjectModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      const timeoutId = setTimeout(() => setIsVisible(false), 300) // Espera a que la animación termine
      return () => clearTimeout(timeoutId)
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 p-4 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        ref={modalRef}
        className={`relative w-full max-w-2xl transform rounded-lg bg-white p-6 shadow-xl transition-all duration-300 ease-in-out dark:bg-gray-800 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          X<span className="sr-only">Cerrar modal</span>
        </button>
        <h2 className="mb-4 text-3xl font-bold">{title}</h2>
        {imgSrc && (
          <Image
            src={imgSrc}
            alt={title}
            width={600}
            height={400}
            className="mb-4 h-64 w-full rounded-lg object-cover"
          />
        )}
        <p className="mb-4 text-gray-700 dark:text-gray-300">{description}</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {tags &&
            tags.map((tag, index) => (
              <span
                key={index}
                className="rounded bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {tag}
              </span>
            ))}
        </div>
        {githubUrl && (
          <div className="flex justify-center">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 transition-colors duration-300 hover:text-gray-900"
            >
              <Github className="h-6 w-6" />
              <span className="sr-only">GitHub Repository</span>
            </a>
          </div>
        )}
        {href && (
          <div className="flex justify-end">
            <Link
              href={href}
              className="text-base font-medium leading-6 text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
              aria-label={`Link to ${title}`}
            >
              Ver proyecto completo &rarr;
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Card
