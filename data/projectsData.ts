const projectsData = [
  {
    title: 'Retrogasteiz',
    description: `Retrogasteiz es un proyecto personal inspirado en iniciativas similares, que presenta una colección de más de 100,000 imágenes del Archivo de Álava, digitalizadas por la Diputación Foral de Álava y publicadas bajo una licencia abierta. Este proyecto investiga nuevas formas de mejorar la visualización de archivos fotográficos públicos, integrando tecnologías de visión artificial y ofreciendo una experiencia de usuario moderna y optimizada. Retrogasteiz no solo proporciona acceso a un valioso patrimonio fotográfico sino que también demuestra el potencial de las bases de datos públicas para el desarrollo comunitario y la colaboración.`,
    imgSrc: '/static/images/retrogasteiz_landscape.webp',
    href: 'https://retrogasteiz.com',
    tags: ['VanillaJS'],
    github: 'https://github.com/0x10-z/retrogasteiz',
  },
  {
    title: 'NMap NSE Cheatsheet',
    description: `Página estática diseñada para centralizar en un único repositorio los scripts NSE de Nmap, tanto oficiales como de terceros, permitiendo la búsqueda eficiente y detallada de su uso para facilitar su posterior implementación.`,
    imgSrc: '/static/images/nse-helper.webp',
    href: '/nse-helper',
    tags: ['NextJS'],
    github: 'https://github.com/0x10-z/my-blog-system/tree/master/app/nse-helper',
  },
  {
    title: 'Music Player',
    description: `Este proyecto es un reproductor de música que reúne algunas de las canciones de rap que marcaron mi infancia. Es un homenaje personal a los raperos locales que influyeron en mi vida y en la cultura de mi zona, celebrando sus letras, ritmos y el legado que dejaron en la comunidad.`,
    imgSrc: '/static/images/music-player.webp',
    href: 'https://gasteizko-rap-player.vercel.app/',
    tags: ['React'],
    github: 'https://github.com/0x10-z/gasteizko-rap-player',
  },
  {
    title: 'Fast GPT',
    description:
      'Este proyecto es una implementación de un clon de ChatGPT utilizando FastAPI en el backend y React para la interfaz de usuario. El objetivo es crear una aplicación web en la que los usuarios puedan interactuar con un modelo de lenguaje basado en IA, similar a ChatGPT, con una interfaz moderna y sencilla.',
    imgSrc: '/static/images/fastapi_landscape2.webp',
    href: null,
    tags: ['Python', 'FastAPI', 'React'],
    github: 'https://github.com/0x10-z/fast-gpt',
  },
  {
    title: 'Ez dago Gasteiz B',
    description: `Ezdagogasteizb es una plataforma dedicada a la concienciación y educación ambiental en Vitoria-Gasteiz, que promueve prácticas sostenibles y ecológicas aplicables en la vida cotidiana. Este proyecto ofrece una serie de consejos prácticos y accesibles para adoptar hábitos más verdes, desde la gestión de residuos hasta la optimización del uso de recursos. Además, fomenta el apoyo al comercio local, destacando cómo las elecciones de consumo pueden influir positivamente en la economía local y el medio ambiente. Ezdagogasteizb busca empoderar a los ciudadanos para que tomen decisiones informadas y responsables que contribuyan a un futuro sostenible..`,
    imgSrc: '/static/images/ezdago_landscape.webp',
    href: 'https://ezdagogasteizb.ikerocio.com',
    tags: ['Python', 'Django'],
    github: null,
  },
  {
    title: 'Calculadora de tiempo de crackeo de una contraseña',
    description: `Esta herramienta interactiva te permite comparar la eficiencia de varios algoritmos de hash comunes, como MD5, SHA-1, SHA-256, bcrypt y Argon2, para determinar el tiempo aproximado que tomaría crackear una contraseña. Ingresando una contraseña, puedes ver cuántos caracteres contiene y calcular cuánto tiempo llevaría descifrarla con cada algoritmo. Además, incluye enlaces a diccionarios populares de cracking que son comúnmente usados en ataques de fuerza bruta. Es ideal para usuarios que quieran entender la relación entre la complejidad de una contraseña y la velocidad con la que diferentes algoritmos pueden romperla.`,
    imgSrc: '/static/images/password-calculator.webp',
    href: '/password-checker',
    tags: ['React'],
    github: 'https://github.com/0x10-z/my-blog-system/tree/master/app/password-checker',
  },
  {
    title: 'Album de fotos con Django',
    description: `Este proyecto es una aplicación web de álbum de fotos desarrollada con Django, que permite a los usuarios cargar, organizar y visualizar fotos en galerías personalizadas. Es ideal para aquellos que desean gestionar imágenes en línea de manera sencilla y eficiente.`,
    imgSrc: '/static/images/aitor_viewbook_landscape3.webp',
    href: 'https://aitorrayo.com/',
    tags: ['Python', 'Django'],
    github: null,
  },
  {
    title: 'DB Multiverse Comic',
    description: `Proyecto de Python que scrapea y que reune algunos de los comics de https://www.dragonball-multiverse.com/es/accueil.html y los transforma en PDF para su descarga.`,
    imgSrc: '/static/images/dragonball-multiverse.webp',
    href: null,
    tags: ['Python'],
    github: 'https://github.com/0x10-z/python-dbuniverse-downloader',
  },
]

export default projectsData
