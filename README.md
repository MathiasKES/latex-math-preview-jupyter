# Live LaTeX Math Jupyter Notebook Preview

A Visual Studio Code extension that provides **live rendering of LaTeX math expressions** while editing Markdown cells in Jupyter notebooks or Markdown files. Ideal for users who want immediate visual feedback on equations without having to execute the cell.

---

## ✨ Features

- 📐 Live line preview of LaTeX math expressions wrapped in `$...$` or `$$...$$`
- 🪄 Supports both **inline** and **display** math modes
- 📄 Works with both `.ipynb` (Jupyter Notebooks) and `.md` (Markdown) files
- 🧭 Renders selected line or current cursor line in a side panel
- ⚡ Powered by KaTeX for fast, clean rendering

---

## 🧪 How to Use

1. **Open a Jupyter Notebook** or Markdown file.
2. Press `Ctrl+Shift+P` and run:
3. Select a line with content wrapped in `$...$` or `$$...$$`.
4. The rendered LaTeX appears in a live side panel.

> ⚠️ Note: Only text wrapped in `$...$` or `$$...$$` will be rendered as math. Other text is ignored or shown as plain text.

---

## 🐞 Known Issues

- Doesn't work with multiline align/equation environments.
- Preview tabs from old sessions doesn't load. An easy fix to this is simply close and reopen the preview.
- Preview doesn't line break properly.
- Preview shows everything and not just LaTeX math.

---

## 📦 Release Notes

### 1.0.1

- Included KaTeX files for offline use

### 1.0.0

- Initial release
- Live side preview of LaTeX from Markdown and Jupyter cells
- Supports inline (`$...$`) and block (`$$...$$`) math using KaTeX

---

## 🙌 Contributing

Contributions, bug reports, and feature suggestions are welcome! Feel free to open an issue or submit a pull request.

---

## 📜 License

MIT
