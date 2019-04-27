// ==UserScript==
// @name         テキストのURLをリンクへ変換する
// @namespace    https://github.com/iskw7y
// @version      1.0.0
// @description  テキストのURLをリンクへ変換します。後から読み込まれるテキストにも反応します。
// @author       iskw7y
// @match        http://*/*
// @match        https://*/*
// @grant        none
// ==/UserScript==

(() => {
  'use strict';

  /**
   * @param {string} url
   */
  function createAnchorElement(url) {
    const el = document.createElement('a');
    el.href = url.startsWith('ttp') ? 'h' + url : url;
    el.rel = 'noopener noreferrer';
    el.target = '_blank';
    el.style.cursor = 'help';
    el.appendChild(document.createTextNode(url));
    return el;
  }

  /**
   * @param {Text} textNode
   */
  function link(textNode) {
    if (textNode.parentElement.closest('a, noscript, script, style, textarea') != null) {
      return;
    }
    const fragment = document.createDocumentFragment();
    let text = textNode.nodeValue;
    let isReplaced = false;
    while (text.length > 0) {
      var m = text.match(/(h?ttps?|ftp):\/\/[-_.!~*'()a-zA-Z0-9;/?:@&=+$,%#]+/);
      if (m) {
        if (m.index > 0) {
          fragment.appendChild(document.createTextNode(text.slice(0, m.index)));
        }
        var url = m[0];
        fragment.appendChild(createAnchorElement(url));
        text = text.slice(m.index + url.length);
        isReplaced = true;
      } else {
        fragment.appendChild(document.createTextNode(text));
        text = '';
      }
    }
    if (isReplaced) {
      textNode.parentNode.replaceChild(fragment, textNode);
    }
  }

  const result = document.evaluate('//text()', document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  for (let i = 0; i < result.snapshotLength; i++) {
    link(result.snapshotItem(i));
  }

  const observer = new MutationObserver((records) => records.forEach((r) => link(r.target)));
  observer.observe(document.body, { characterData: true, subtree: true });
})();
