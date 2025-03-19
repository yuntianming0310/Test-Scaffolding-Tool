import { analyzeKXML } from './analyzeKXML.js'
import { generateAST } from './generateAST.js'
import { kxmlDOMRenderer } from './kxmlDOMRenderer.js'

const KxmlDOM = (function () {
  function render(filePath, root) {
    fetch(filePath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.text()
      })
      .then(fileContent => {
        const tokens = analyzeKXML(fileContent)
        const ast = generateAST(tokens)
        kxmlDOMRenderer(ast, root, filePath)
      })
      .catch(error => {
        console.error('加载文件失败:', error)
      })
  }

  return {
    render,
  }
})()

export default KxmlDOM
