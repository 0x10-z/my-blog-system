import InteractiveCard from '@/components/InteractiveCard'
import Link from '@/components/Link'

export default function NotFound() {
  return (
    <InteractiveCard>
      <div className="flex flex-col items-center justify-center space-y-5">
        <h1 className="text-6xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 md:text-8xl">
          404 🤷‍♂️
        </h1>
        <p className="text-xl font-bold leading-normal md:text-2xl">
          ¡Ups! 🙈 No encontramos esa página.
        </p>
        <p>
          Pero no te preocupes, 🌟 hay un montón de cosas geniales esperándote en nuestra página de
          inicio. 🚀
        </p>
        <Link
          href="/"
          className="focus:shadow-outline-blue rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-blue-700 focus:outline-none dark:hover:bg-blue-500"
        >
          Volver a la página de inicio 🏠
        </Link>
      </div>
    </InteractiveCard>
  )
}
