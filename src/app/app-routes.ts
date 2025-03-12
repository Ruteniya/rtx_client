const adminRoute = '/admin'

export enum AppRoutes {
  main = '/',
  about = '/about',
  login = '/login',
  currentGroup = '/group',

  admin = adminRoute,
  groups = adminRoute + '/groups',
  categories = adminRoute + '/categories',
  game = adminRoute + '/game',
  nodes = adminRoute + '/nodes'
}
