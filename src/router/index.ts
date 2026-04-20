import { createRouter } from '@/plugin/uni-mini-router'
import pagesJson from '../pages.json'
import pagesJsonToRoutes from 'uni-parse-pages'
import { HOME_PAGE } from '@/common/constants'

const routes = pagesJsonToRoutes(pagesJson)
setRouteName(routes)

const router = createRouter({
  routes: [...routes],
})

export const whiteList = [HOME_PAGE]
export const loginPage = HOME_PAGE

export const beforEach = (to, _from, next) => {
  if (!to?.path || to.path === '/') {
    next({ path: HOME_PAGE })
    return
  }

  next()
}

router.beforeEach(beforEach)

function setRouteName(routes) {
  routes.forEach((item) => {
    if (item.path) {
      item.name = item.path.split('/').pop()
    }
  })
}

export default router
