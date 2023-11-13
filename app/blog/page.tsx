import ListLayout from '@/layouts/ListLayout'
import { CoreContent, allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { Blog, allBlogs } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import { Texts } from '@/components/texts'

const POSTS_PER_PAGE = 5

export const metadata = genPageMetadata({ title: 'Blog' })

export default function BlogPage() {
  const posts: CoreContent<Blog>[] = allCoreContent(sortPosts(allBlogs))
  const pageNumber = 1
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }

  return (
    <ListLayout
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title={Texts.allPosts}
    />
  )
}
