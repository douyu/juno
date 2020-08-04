import {editor, languages, Range} from "monaco-editor";
const monaco = {editor, languages, Range}

import initLanguage from "./language";

let languageInitialized = false
let conditionWhenSelect = null
let conditionWhenMouseOnVar = null
let currentResourceVar = ''
let _option = {
  onInsertResource: null,
  onLoadResourceDetail: null
}

export function createEditor(ref, option) {
  _option = option

  let editorInstance = monaco.editor.create(
    ref.current,
    {
      theme: 'dy-vs-dark',
      language: 'dy/' + option.format,
      automaticLayout: true
    }
  )

  registerConditions(editorInstance)
  registerActions(editorInstance)

  if (!languageInitialized) {
    languageInitialized = true

    initLanguage()

    registerHover()
  }

  return editorInstance
}

export function createDiffEditor(ref, origin, modified) {
  let editorInstance = monaco.editor.createDiffEditor(
    ref.current,
    {
      theme: 'dy-vs-dark',
      language: 'toml',
      automaticLayout: true,
      enableSplitViewResizing: false
    }
  )

  const originModel = monaco.editor.createModel(origin)
  const modifiedModel = monaco.editor.createModel(modified)

  editorInstance.setModel({
    original: originModel,
    modified: modifiedModel
  })

  return editorInstance
}

function registerHover() {
  let provider = {
    //@ts-ignore
    provideHover(model, position) {
      if (conditionWhenMouseOnVar && conditionWhenMouseOnVar.get() && _option.onLoadResourceDetail) {
        return _option.onLoadResourceDetail(currentResourceVar).then(r => {
          console.log(r)
          let contents = [
            {value: `**${r.name}**`},
          ]

          let content = `**Description:** ${r.description}\n\n**Value:** \`${r.value}\`\n\n**Author:** ${r.user_name}`

          if (r.tags && r.tags.length > 0) {
            content += "\n\n**Tags:** " + r.tags.join(', ')
          }

          contents.push({
            value: content
          })

          return {
            range: new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column),
            contents: contents
          }
        })
      }
      return undefined;
    }
  }

  monaco.languages.registerHoverProvider("dy/toml", provider)
  monaco.languages.registerHoverProvider("dy/yaml", provider)
  monaco.languages.registerHoverProvider("dy/ini", provider)
}

function registerConditions(e) {
  registerMouseOnVarCondition(e)
  registerSelectCondition(e)
}

function registerMouseOnVarCondition(e) {
  conditionWhenMouseOnVar = e.createContextKey('whenMouseOnVar', false)

  e.onMouseMove(ev => {
    const element = ev.target.element
    if (!element) return;

    const prevEle = element.previousSibling
    const nextEle = element.nextElementSibling
    if (!nextEle || !prevEle) return

    const prevText = prevEle.textContent || ''
    const nextText = nextEle.textContent || ''

    if (prevText.endsWith("{{") && nextText.startsWith("}}")) {
      console.log(ev.event)
      conditionWhenMouseOnVar.set(true)
      currentResourceVar = element.textContent
    } else {
      conditionWhenMouseOnVar.set(false)
      currentResourceVar = null
    }
  })
}

function registerSelectCondition(e) {
  conditionWhenSelect = e.createContextKey('whenCodeSelection', false)

  e.onDidChangeCursorSelection(ev => {
    const selection = ev.selection
    if (selection.startColumn !== selection.endColumn) {
      conditionWhenSelect.set(true)
    } else {
      conditionWhenSelect.set(false)
    }
  })
}

function registerActions(e) {

  // e.addAction({
  //   id: 'changeResource',
  //   label: '修改资源',
  //   contextMenuGroupId: 'navigation',
  //   contextMenuOrder: 1,
  //   precondition: 'whenMouseOnVar',
  //   run: (e) => {
  //
  //   },
  // })

  e.addAction({
    id: 'insertResource',
    label: '插入资源',
    contextMenuGroupId: 'navigation',
    contextMenuOrder: 1,
    precondition: '!whenMouseOnVar',
    run(editor, ...args) {
      let selection = editor.getSelection()

      let model = editor.getModel()
      let pos = editor.getPosition()
      console.log(model, pos)
      _option.onInsertResource && _option.onInsertResource((fields) => {
        //@ts-ignore
        let range = new monaco.Range(pos.lineNumber, pos.column, pos?.lineNumber, pos?.column);
        if (selection !== null) {
          range = new monaco.Range(selection.startLineNumber, selection.startColumn, selection.endLineNumber, selection.endColumn)
        }

        let text = '{{' + fields.name + '@' + fields.latest_version + '}}';
        let op = {identifier: {major: 1, minor: 1}, range: range, text: text, forceMoveMarkers: true};
        editor.executeEdits("my-source", [op]);
      })
    }
  })
}
