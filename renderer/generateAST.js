export function generateAST(tokens) {
  const stack = []
  const root = {
    type: 'Root',
    children: [],
  }

  stack.push(root)

  for (const token of tokens) {
    if (token.type === 'openTag') {
      const astNode = {
        tag: token.tagName,
        attrs: token.attributes,
        children: [],
      }

      // Add node as a child, and push into stack
      stack[stack.length - 1].children.push(astNode)
      stack.push(astNode)
    }

    if (token.type === 'closeTag') {
      stack.pop()
    }

    if (token.type === 'text') {
      stack[stack.length - 1].content = token.value.trim()
    }
  }

  return root
}
