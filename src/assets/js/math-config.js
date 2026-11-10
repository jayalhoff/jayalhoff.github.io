// MathJax configuration (loaded before the library; must stay an external file
// so the CSP can forbid inline scripts).
window.MathJax = {
  tex: {
    inlineMath: [["$", "$"], ["\\(", "\\)"]],
    displayMath: [["$$", "$$"], ["\\[", "\\]"]],
    processEscapes: true,
  },
  svg: { fontCache: "global" },
  options: { skipHtmlTags: ["script", "noscript", "style", "textarea", "pre", "code"] },
};
