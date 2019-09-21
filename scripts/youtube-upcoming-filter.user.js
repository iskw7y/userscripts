// ==UserScript==
// @name         YouTubeの配信予定のセルを抽出表示する
// @namespace    https://github.com/iskw7y
// @version      1.0.0
// @description  YouTubeの配信予定のセルを抽出表示するショートカットキーを追加します。
// @author       iskw7y
// @match        https://www.youtube.com/feed/subscriptions
// @grant        none
// ==/UserScript==

(() => {
  'use strict';

  /**
   * @param {string} xpath
   */
  function getElementsByXpath(xpath) {
    const snapshot = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    const elements = [];
    for (let i = 0; i < snapshot.snapshotLength; i++) {
      elements.push(snapshot.snapshotItem(i));
    }
    return elements;
  }

  const NOT_UPCOMING_CELL_XPATH = `//ytd-grid-video-renderer[not(.//ytd-thumbnail-overlay-time-status-renderer[@overlay-style="UPCOMING"])]`;

  /**
   * @param {boolean} displayed
   */
  function toggleNotUpcomingCell(displayed) {
    const value = displayed ? '' : 'none';
    for (const el of getElementsByXpath(NOT_UPCOMING_CELL_XPATH)) {
      el.style.display = value;
    }
  }

  const state = {
    key: '',
    displayed: true,
  };

  /**
   * @param {KeyboardEvent} e
   */
  function onKeydown(e) {
    const key = e.key;
    if (key !== state.key && key === 'U') {
      state.displayed = !state.displayed;
      toggleNotUpcomingCell(state.displayed);
    }
    state.key = key;
  }

  function onKeyup() {
    state.key = '';
  }

  document.addEventListener('keydown', onKeydown, false);
  document.addEventListener('keyup', onKeyup, false);
})();
