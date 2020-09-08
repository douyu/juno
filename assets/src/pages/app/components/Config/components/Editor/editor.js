import * as monaco from "monaco-editor";
import prettier from "prettier/standalone";
import prettierYaml from "prettier/parser-yaml"
import tomlParser from "./parsers/parser-toml/api"
import iniPrettierPlugin from 'prettier-plugin-ini'
import initLanguage from "./language";
import {message} from "antd";

let languageInitialized = false
let conditionWhenSelect = null
let conditionWhenMouseOnVar = null
let currentResourceVar = ''
let _option = {
  onInsertResource: null,
  onLoadResourceDetail: null
}
let tomlPrettierPlugin = null
let decorations = []

monaco.editor.defineTheme('dy-vs-dark', {
  colors: {},
  inherit: true,
  base: 'vs-dark',
  rules: [
    {
      token: 'variable',
      foreground: '#8fd9ff',
      fontStyle: 'bold'
    },
    {
      token: 'string.escape',
      foreground: '#668658',
      fontStyle: 'bold'
    }
  ]
})

export function createEditor(ref, option) {
  _option = option

  let editorInstance = monaco.editor.create(
    ref.current,
    {
      theme: 'dy-vs-dark',
      language: 'dy/' + option.format,
      automaticLayout: true,
      readOnly: option.readOnly
    }
  )

  {
    tomlPrettierPlugin = tomlParser({
      onParseError: err => onParseError(editorInstance, err),
      onLexError: err => onLexError(editorInstance, err)
    })
  }

  editorInstance.onDidChangeModelContent(ev => {
    decorations = editorInstance.deltaDecorations(decorations, [])
    formatCode(editorInstance, option.format, false)
  })

  registerConditions(editorInstance)
  registerActions(editorInstance, option.format)

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
      automaticLayout: true,
      enableSplitViewResizing: false,
      readOnly: true,
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
            {value: `资源变量: **${r.name}**`},
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

function onLexError(editor, err) {
  console.debug(err)
  decorations = editor.deltaDecorations(
    decorations,
    err.map(e => {
      return {
        range: new monaco.Range(e.line, e.column, e.line, e.column + e.length),
        options: {
          hoverMessage: [{value: e.message}],
          inlineClassName: 'editor-error-line'
        }
      }
    })
  )
}

function onParseError(editor, err) {
  console.debug(err)
  decorations = editor.deltaDecorations(
    decorations,
    err.map(e => {
      let {startLine, endLine, startColumn, endColumn} = e.token
      if (endColumn === startColumn) endColumn = startColumn + 1
      return {
        range: new monaco.Range(startLine, startColumn, endLine, endColumn),
        options: {
          hoverMessage: [{value: e.message}],
          inlineClassName: 'editor-error-line'
        }
      }
    })
  )
}

function formatCode(editor, fileFormat, format = true) {
  let model = editor.getModel()
  let content = model.getValue()
  let resourceReg = /\{\{[^\}]+\}\}/
  if (content.match(resourceReg) && fileFormat === 'yaml') {
    if (!format) return
    return message.warn("YAML格式暂不支持资源语法格式化")
  }

  try {
    let formatted = prettier.format(model.getValue(), {
      parser: fileFormat,
      plugins: [
        tomlPrettierPlugin,
        iniPrettierPlugin,
        prettierYaml,
      ],
    })
    format && model.setValue(formatted)
  } catch (e) {
    console.debug(e)
  }
}

function registerActions(e, format) {

  e.addAction({
    id: 'FormatDocument',
    contextMenuGroupId: 'navigation',
    contextMenuOrder: 2,
    label: '格式化',
    keybindings: [
      monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KEY_F
    ],
    run(editor) {
      formatCode(editor, format)
    }
  })

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
