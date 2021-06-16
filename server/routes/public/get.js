module.exports = async function(fastify) {
  fastify.get('', async function(req, reply) {
    const [files] = await fastify.storage.getFiles()

    const publicFiles = []

    files.forEach(file => {
      const filename = file.name.split('/')
      const data = file.metadata
      if (filename[0] === 'files' && filename[1]) {
        publicFiles.push({
          name: filename[1],
          size: humanFileSize(data.size),
          uploaded: data.timeCreated,
          contentType: data.contentType
        })
      }
    })
    reply.send(publicFiles)
  })
}

function humanFileSize(bytes) {
  const thresh = 1000

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
