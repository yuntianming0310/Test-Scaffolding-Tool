export function analyzeKXML(html) {
  const tokens = []
  const htmlContent = html
    .replace(/[\n\r]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  const length = htmlContent.length

  let index = 0
  while (index < length) {
    if (htmlContent[index] === ' ') {
      index++
      continue
    }

    // capturing the tag
    if (htmlContent[index] === '<') {
      const closingBracketIndex = htmlContent.indexOf('>', index)
      const tagContent = htmlContent.substring(index, closingBracketIndex + 1)

      // handle different tag type
      if (tagContent.startsWith('</')) {
        tokens.push({
          type: 'closeTag',
          value: tagContent.slice(2, -1),
        })
      } else {
        const tagNode = constructAttributes(tagContent)
        tagContent && tokens.push(tagNode)
      }

      index = closingBracketIndex + 1
    }
    // capturing the text content
    else {
      const nearestOpenBracketIndex = htmlContent.indexOf('<', index)
      const text = htmlContent.substring(index, nearestOpenBracketIndex)

      if (text) {
        tokens.push({
          type: 'text',
          value: text,
        })
      }

      index = nearestOpenBracketIndex
    }
  }

  return tokens
}

function constructAttributes(tagContent) {
  const tagContentMatch = tagContent.match(/<([\w-]+)([^>]*)>/)
  if (!tagContentMatch) return null

  const [_, tagName, attrs] = tagContentMatch

  const attributes = {}
  // constructure the attributes and turn it into object
  const normalAttrs = attrs.match(/(\w+)="([^"]*)"/g) || []
  normalAttrs.forEach(attr => {
    const parts = attr.match(/(\w+)="([^"]*)"/)
    if (parts) {
      const [_, key, value] = parts
      attributes[key] = value
    }
  })

  // return a K_Node Object
  return {
    type: 'openTag',
    tagName,
    attributes,
  }
}
