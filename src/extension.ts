import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  console.log('Extension "explorelogs" active')
  const disposable = vscode.commands.registerCommand(
    'explorelogs.formatEditor',
    async () => {
      // Get the active text editor
      const editor = vscode.window.activeTextEditor
      if (editor) {
        const document = editor.document
        const fullText = document.getText()

        // Determine if the first non-whitespace character is `[`
        const firstNonWhitespace = fullText.trimStart().charAt(0)
        const needsOpeningBracket = firstNonWhitespace !== '['

        // Determine if the last non-whitespace character is `]`
        const lastNonWhitespace = fullText.trimEnd().slice(-1)
        const needsClosingBracket = lastNonWhitespace !== ']'
        // Perform the search and replace
        let newText = fullText.replace(
          /^(\{.{100,}\})$/gm,
          (match, group1) => `${group1},`,
        )
        newText = newText.replace(/\}\n\]$/gm, '},')
        if (!newText.trim().startsWith('[')) newText = `[\n${newText}`
        if (!newText.trim().endsWith(']')) newText = `${newText}\n]`

        // Replace the entire document with the modified text
        await editor.edit((editBuilder) => {
          const firstLine = document.lineAt(0)
          const lastLine = document.lineAt(document.lineCount - 1)
          const fullRange = new vscode.Range(
            firstLine.range.start,
            lastLine.range.end,
          )
          editBuilder.replace(fullRange, newText)
        })

        await vscode.commands.executeCommand('editor.action.formatDocument')
      }
    },
  )

  context.subscriptions.push(disposable)
}

export function deactivate() {}
