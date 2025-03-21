const adminRoute = '/admin'

export enum AppRoutes {
  main = '/',
  about = '/about',
  login = '/login',
  currentGroup = '/group',

  admin = adminRoute,
  groups = adminRoute + '-groups',
  categories = adminRoute + '-categories',
  game = adminRoute + '-game',
  nodes = adminRoute + '-nodes',
  allAnswers = adminRoute + '-all-answers',
  processedAnswers = adminRoute + '-processed-answers',
  unprocessedAnswers = adminRoute + '-unprocessed-answers',
  users = adminRoute + '-users',
  results = adminRoute + '-results'
}
