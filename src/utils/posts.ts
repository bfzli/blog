import type { Post } from '@/types'

import { constants } from '@/config'

const { postsPerPage } = constants.pagination

export const sortByDate = (posts: Post[]) =>
    [...posts].sort((a, z) => +new Date(z.data.date) - +new Date(a.data.date))

export const pageCount = (total: number) =>
    Math.max(1, Math.ceil(total / postsPerPage))

export const postsForPage = (posts: Post[], page: number) =>
    posts.slice((page - 1) * postsPerPage, page * postsPerPage)

export const pagePath = (page: number) => (page <= 1 ? '/' : `/page/${page}`)