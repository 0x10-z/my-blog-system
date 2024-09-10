'use client'
import { useState, useRef, useEffect } from 'react'
import Image from './Image'
import Link from './Link'

interface CardProps {
  title: string
  description: string
  imgSrc?: string
  href?: string
}

const Card = ({ title, description, imgSrc, href }: CardProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [maxHeight, setMaxHeight] = useState('80px') // Establece una altura inicial

  const contentRef = useRef<HTMLDivElement>(null)

  const toggleDescription = () => {
    setIsExpanded(!isExpanded)
  }

  useEffect(() => {
    // Calcula la altura total del contenido y ajusta la propiedad maxHeight
    if (isExpanded) {
      setMaxHeight(`${contentRef.current?.scrollHeight}px`)
    } else {
      setMaxHeight('80px') // Altura cuando está colapsado
    }
  }, [isExpanded])

  return (
    <div className="w-full p-4 md:max-w-[30%]">
      <div
        className={`${
          imgSrc && 'h-full'
        } overflow-hidden rounded-md border-2 border-gray-200 border-opacity-60 dark:border-gray-700`}
      >
        {imgSrc &&
          (href ? (
            <Link href={href} aria-label={`Link to ${title}`}>
              <Image
                alt={title}
                src={imgSrc}
                className="object-cover object-center md:h-36 lg:h-48"
                width={544}
                height={306}
              />
            </Link>
          ) : (
            <Image
              alt={title}
              src={imgSrc}
              className="object-cover object-center md:h-36 lg:h-48"
              width={544}
              height={306}
            />
          ))}
        <div className="p-6">
          <h2 className="mb-3 text-2xl font-bold leading-8 tracking-tight">
            {href ? (
              <Link href={href} aria-label={`Link to ${title}`}>
                {title}
              </Link>
            ) : (
              title
            )}
          </h2>

          <div
            ref={contentRef}
            style={{ maxHeight, transition: 'max-height 0.5s ease' }}
            className="overflow-hidden"
          >
            <p className="prose mb-3 max-w-none text-gray-500 dark:text-gray-400">{description}</p>
          </div>

          <div className="flex items-center justify-between">
            {description.length > 100 && (
              <button
                onClick={toggleDescription}
                className="text-base font-medium leading-6 text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
              >
                {isExpanded ? 'Leer menos' : 'Leer más'}
              </button>
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
    </div>
  )
}

export default Card
