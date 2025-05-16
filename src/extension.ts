import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let panel: vscode.WebviewPanel | undefined;

    const updateWebview = (rawText: string) => {
        if (panel) {
            panel.webview.html = getWebviewContent(rawText);
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
            panel.webview.html = getWebviewContent('');
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

function getWebviewContent(raw: string): string {
    // Escape HTML
    const escaped = raw.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <script src="https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.js"></script>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css" />
      <style>
        body { font-family: sans-serif; padding: 1rem; }
        #output { font-size: 1.2rem; white-space: pre-wrap; }
      </style>
    </head>
    <body>
      <div id="output"></div>
      <script>
        (function() {
          const raw = ${JSON.stringify(escaped)};
          const output = document.getElementById('output');
          
          // Try block math first: $$...$$
          let match = raw.match(/\\$\\$([\\s\\S]+?)\\$\\$/);
          let display = false;
          let content = '';

          if (match) {
            display = true;
            content = match[1];
          } else {
            // Try inline math: $...$
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
            // No valid delimiters found: show raw text
            output.textContent = raw;
          }
        })();
      </script>
    </body>
    </html>
    `;
}
