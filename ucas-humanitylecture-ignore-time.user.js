// ==UserScript==
// @name         UCAS 人文讲座忽略时间报名
// @namespace    https://jwxk.ucas.ac.cn/
// @version      1.0.1
// @description  在 UCAS 人文讲座报名按钮旁添加“忽略时间报名”，报名时间改为当天 23:00-23:30，用于绕过与课程时间冲突的限制
// @author       LLL0u1s
// @license      MIT
// @homepageURL  https://github.com/LLL0u1s/UCAS-humanityLecture
// @supportURL   https://github.com/LLL0u1s/UCAS-humanityLecture/issues
// @match        https://jwxk.ucas.ac.cn/subject/humanityLecture*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const MARKER = 'ucas-ignore-time-sign';

    function addButtons() {
        const buttons = document.querySelectorAll(
            'a[onclick*="toSign("]:not([data-ucas-processed])'
        );

        for (const originalButton of buttons) {
            originalButton.dataset.ucasProcessed = 'true';

            const onclick = originalButton.getAttribute('onclick') || '';

            const match = onclick.match(
                /toSign\s*\(\s*(['"])(.*?)\1\s*,\s*(['"])(\d{4}-\d{2}-\d{2})\s+[^'"]+\3\s*\)/
            );

            if (!match) {
                continue;
            }

            const lectureId = match[2];
            const date = match[4];
            const newTime = `${date} 23:00-23:30`;

            const nextElement = originalButton.nextElementSibling;
            if (nextElement?.classList.contains(MARKER)) {
                continue;
            }

            const newButton = originalButton.cloneNode(true);

            newButton.textContent = '忽略时间报名';
            newButton.classList.add(MARKER);
            newButton.removeAttribute('data-ucas-processed');
            newButton.setAttribute(
                'onclick',
                `toSign(${JSON.stringify(lectureId)}, ${JSON.stringify(newTime)}); return false;`
            );
            newButton.style.marginLeft = '8px';

            originalButton.insertAdjacentElement('afterend', newButton);
        }
    }

    addButtons();

    const observer = new MutationObserver(addButtons);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
