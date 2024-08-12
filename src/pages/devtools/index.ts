try {
  chrome.devtools.panels.create('Dev Tools', 'icons/levi48x48.png', 'src/pages/panel/index.html');
} catch (e) {
  console.error(e);
}
