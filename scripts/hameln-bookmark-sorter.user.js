// ==UserScript==
// @name         ハーメルンのしおりをソートする
// @namespace    https://github.com/iskw7y
// @version      1.0.0
// @description  ハーメルンのしおりを「削除された小説・未読の小説・既読の小説」の順へソートします。
// @author       iskw7y
// @match        https://syosetu.org/?mode=siori2_view
// @grant        none
// ==/UserScript==

(() => {
  'use strict';

  /**
   * @callback PageElementGetter
   * @param {Element} row
   * @returns {Element}
   */

  /**
   * @param {Element} rows
   * @param {number} headerRowCount
   * @param {number} footerRowCount
   * @param {PageElementGetter} getPageElement
   */
  function sort(rows, headerRowCount, footerRowCount, getPageElement) {
    const deletedRows = [];
    const unreadRows = [];
    const readRows = [];

    while (rows.children.length > headerRowCount + footerRowCount) {
      const row = rows.children[headerRowCount];
      const m = getPageElement(row).textContent.match(/^(\d+)話／全(\d+)?話$/);
      if (m[2] == null) {
        deletedRows.push(row);
      } else if (Number(m[1]) !== Number(m[2])) {
        unreadRows.push(row);
      } else {
        readRows.push(row);
      }
      rows.removeChild(row);
    }

    const fragment = document.createDocumentFragment();
    deletedRows.forEach((row) => fragment.appendChild(row));
    unreadRows.forEach((row) => fragment.appendChild(row));
    readRows.forEach((row) => fragment.appendChild(row));

    rows.insertBefore(fragment, rows.children[headerRowCount]);
  }

  const siori = document.getElementsByName('siori')[0];
  const tbody = siori.querySelector('.table1 > tbody');
  if (tbody) {
    sort(tbody, 1, 0, (row) => row.children[2]);
  } else {
    const ul = siori.getElementsByTagName('ul')[0];
    sort(ul, 4, 1, (row) => row.getElementsByClassName('date')[0]);
  }
})();
