'use client';

import type { MouseEvent } from 'react';

/**
 * "Get Belltower" that copies the invite link on its way to the App Store, so the app can offer to paste it after
 * installing instead of making them come back here. Without JavaScript, or if copying fails, it's a plain link.
 */
export function GetButton({ href, link, className }: { href: string; link: string; className: string }) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Let modified clicks (new tab, etc.) behave like a normal link.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    let left = false;
    const go = () => {
      if (left) return;
      left = true;
      window.location.href = href;
    };
    // Never hold them here for long, even if the clipboard hangs.
    setTimeout(go, 600);
    copy(link).finally(go);
  };

  return (
    <a className={className} href={href} onClick={onClick}>
      Get Belltower
    </a>
  );
}

async function copy(link: string): Promise<void> {
  // First a synchronous copy while the tap still counts as a user gesture, so something lands on the clipboard
  // even where the async API is missing or refuses (in-app browsers, older iOS).
  copySync(link);
  try {
    // Then upgrade it to a URL as well as text, so iOS reports it as a link without reading it.
    const types: Record<string, Blob> = { 'text/plain': new Blob([link], { type: 'text/plain' }) };
    if (typeof ClipboardItem !== 'undefined' && (!ClipboardItem.supports || ClipboardItem.supports('text/uri-list')))
      types['text/uri-list'] = new Blob([link], { type: 'text/uri-list' });
    if (navigator.clipboard?.write && typeof ClipboardItem !== 'undefined') await navigator.clipboard.write([new ClipboardItem(types)]);
    else if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(link);
  } catch {
    // The synchronous copy already ran.
  }
}

function copySync(text: string) {
  try {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    area.style.fontSize = '16px'; // Below 16px, iOS zooms the page to focus it.
    document.body.appendChild(area);
    area.select();
    area.setSelectionRange(0, text.length);
    document.execCommand('copy');
    area.remove();
  } catch {}
}
