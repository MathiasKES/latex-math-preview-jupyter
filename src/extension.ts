import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let panel: vscode.WebviewPanel | undefined;

    const updateWebview = (rawText: string) => {
        if (panel) {
            panel.webview.html = getWebviewContent(rawText, panel.webview, context.extensionUri);
        }
    };

    context.subscriptions.push(
        vscode.commands.registerCommand('latex-math-preview-jupyter.startPreview', () => {
            panel = vscode.window.createWebviewPanel(
                'latexPreview',
                'LaTeX Live Preview',
                vscode.ViewColumn.Beside,
                {
                    enableScripts: true
                }
            );
            panel.webview.html = getWebviewContent('', panel.webview, context.extensionUri);
        })
    );

    vscode.window.onDidChangeTextEditorSelection(event => {
        const editor = event.textEditor;
        const doc = editor.document;

        // Only trigger on Markdown files or .ipynb (we'll refine .ipynb later)
        if (doc.languageId === 'markdown' || doc.fileName.endsWith('.ipynb')) {
            const sel = editor.selection;
            const text = sel.isEmpty
                ? doc.lineAt(sel.active.line).text
                : doc.getText(sel);
            updateWebview(text);
        }
    });
}

function getWebviewContent(raw: string, webview: vscode.Webview, extensionUri: vscode.Uri): string {
    const katexJsUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'katex.min.js'));
    const katexCssUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'katex.min.css'));

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <link rel="stylesheet" href="${katexCssUri}">
      <style>
        body { font-family: sans-serif; padding: 1rem; }
        #output { font-size: 1.2rem; white-space: pre-wrap; }
      </style>
    </head>
    <body>
      <div id="output"></div>
      <script src="${katexJsUri}"></script>
      <script>
        (function() {
          const raw = ${JSON.stringify(raw)};
          const output = document.getElementById('output');
          let match = raw.match(/\\$\\$([\\s\\S]+?)\\$\\$/);
          let display = false;
          let content = '';

          if (match) {
            display = true;
            content = match[1];
          } else {
            match = raw.match(/\\$([^\\$]+?)\\$/);
            if (match) {
              display = false;
              content = match[1];
            }
          }

          if (content) {
            try {
              katex.render(content, output, {
                throwOnError: false,
                displayMode: display
              });
            } catch (e) {
              output.textContent = 'KaTeX render error';
            }
          } else {
            output.textContent = raw;
          }
        })();
      </script>
    </body>
    </html>
    `;
}

