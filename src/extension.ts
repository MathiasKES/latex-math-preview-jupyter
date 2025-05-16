import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let panel: vscode.WebviewPanel | undefined;

    const updateWebview = (content: string) => {
        if (panel) {
            panel.webview.html = getWebviewContent(content);
        }
    };

    context.subscriptions.push(
        vscode.commands.registerCommand('latex-preview-jupyter.startPreview', () => {
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

        if (doc.languageId === 'markdown' || doc.fileName.endsWith('.ipynb')) {
            const selection = editor.selection;
            const text = doc.getText(selection.isEmpty ? doc.lineAt(selection.active.line).range : selection);
            updateWebview(text);
        }
    });
}

function getWebviewContent(latex: string): string {
    const escaped = latex.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <script src="https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.js"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css" />
        <style>
            body { font-family: sans-serif; padding: 1rem; }
            #output { font-size: 1.2rem; }
        </style>
    </head>
    <body>
        <div id="output"></div>
        <script>
            try {
                katex.render(${JSON.stringify(latex)}, document.getElementById('output'), {
                    throwOnError: false,
                    displayMode: true
                });
            } catch (e) {
                document.getElementById('output').innerText = 'Error rendering LaTeX';
            }
        </script>
    </body>
    </html>
    `;
}
