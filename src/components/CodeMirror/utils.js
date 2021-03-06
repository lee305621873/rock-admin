import CodeMirror from 'codemirror'

export function addNewLine(cm, text) {
  const line = cm.getCursor()
  cm.replaceRange(text, line)
}

export function synonyms(cm, keywords) {
  return new Promise(function(accept) {
    setTimeout(function() {
      const cursor = cm.getCursor()
      const line = cm.getLine(cursor.line)
      let start = cursor.ch
      let end = cursor.ch
      while (start && /\w/.test(line.charAt(start - 1))) --start
      while (end < line.length && /\w/.test(line.charAt(end))) ++end
      const word = line.slice(start, end).toLowerCase()
      const list = keywords.filter(item => item.indexOf(word) === 0)
      return accept({ list: list,
        from: CodeMirror.Pos(cursor.line, start),
        to: CodeMirror.Pos(cursor.line, end) })
    }, 100)
  })
}
