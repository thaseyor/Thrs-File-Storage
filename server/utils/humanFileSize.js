/**
 *
 * @param {number} bytes
 * @returns {string}
 */

module.exports = function humanFileSize(bytes) {
  const thresh = 1024

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B'
  }

  const units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let u = -1
  const r = 10

  do {
    bytes /= thresh
    ++u
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  )

  return bytes.toFixed(1) + ' ' + units[u]
}
