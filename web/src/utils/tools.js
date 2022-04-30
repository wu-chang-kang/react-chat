/**
 * 包含n个工具函数
 */
export function getRedirectTo(avatar) {
  let path
  if (avatar) {
    path = 'main-list'
  } else {
    path = 'complete-info'
  }
  return path
}
