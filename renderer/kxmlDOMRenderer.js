import K_ELMENT_MAPS from './K_ElementsMap.js'

export async function kxmlDOMRenderer(ast, root, filePath) {
  try {
    const moduleExports = await import(`${filePath.replace('.kxml', '')}.js`)

    const workingQueue = []
    workingQueue.push(ast)

    const fragment = new DocumentFragment()

    while (workingQueue.length) {
      const { type, tag, attrs, children, content, parentNode } =
        workingQueue.shift()

      if (type === 'Root') {
        children.forEach(child => {
          child.parentNode = fragment
          workingQueue.push(child)
        })
      }

      if (tag) {
        const el = document.createElement(K_ELMENT_MAPS[tag])
        if (attrs && Object.keys(attrs).length > 0) {
          for (let key in attrs) {
            el.setAttribute(key, attrs[key])
          }
        }

        if (content) {
          const processText = processVariable(content, moduleExports)
          el.innerText = processText
        }

        if (children.length > 0) {
          children.forEach(child => {
            child.parentNode = el
            workingQueue.push(child)
          })
        }

        if (parentNode) parentNode.appendChild(el)
      }
    }

    root.appendChild(fragment)
  } catch (error) {
    console.error('💥 Rendering Process Error!', error)
  }
}

/**
 * Fill the variables hole in kxml
 * {{variable}}
 */
function processVariable(text, dataContext) {
  return text.replace(/\{\{([^}]+)\}\}/g, (match, expression) => {
    const key = expression.trim()
    return dataContext[key] !== undefined ? dataContext[key] : match
  })
}
