import * as sanitizeHtml from 'sanitize-html';

export function sanitizeInput(html: string): string {
    return sanitizeHtml(html, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([
            'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'video', 'audio', 'source', 'track',
            'iframe', 'blockquote', 'cite', 'code', 'pre', 'del', 'ins', 'strong', 'em', 'mark',
            'abbr', 'sub', 'sup', 'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'table', 'thead', 'tbody',
            'tfoot', 'tr', 'th', 'td', 'caption', 'form', 'input', 'textarea', 'select', 'option',
            'button', 'label', 'fieldset', 'legend', 'datalist', 'optgroup', 'meter', 'progress',
            'details', 'summary', 'figure', 'figcaption', 'time', 'small', 'bdi', 'bdo', 'samp',
            'kbd', 'var', 'q', 'ruby', 'rt', 'rp', 'wbr', 'hr', 'br', 'span', 'div', 'section',
            'article', 'aside', 'nav', 'header', 'footer', 'main', 'address'
        ]),
        allowedAttributes: {
            '*': [
                'href', 'src', 'alt', 'title', 'style', 'class', 'id', 'name', 'data-*', 'role',
                'aria-*', 'tabindex', 'contenteditable', 'spellcheck', 'draggable', 'translate',
                'hidden', 'dir', 'lang', 'contextmenu', 'accesskey', 'autofocus'
            ],
            'a': ['target', 'rel', 'download'],
            'img': ['width', 'height', 'loading'],
            'video': ['controls', 'autoplay', 'muted', 'loop', 'poster', 'preload'],
            'audio': ['controls', 'autoplay', 'muted', 'loop', 'preload'],
            'iframe': ['width', 'height', 'frameborder', 'allow', 'allowfullscreen', 'sandbox'],
            'form': ['action', 'method', 'enctype', 'novalidate'],
            'input': ['type', 'value', 'placeholder', 'checked', 'disabled', 'readonly', 'required'],
            'button': ['type', 'disabled'],
            'select': ['multiple', 'disabled', 'required'],
            'option': ['value', 'selected'],
            'table': ['border', 'cellpadding', 'cellspacing', 'summary'],
            'td': ['colspan', 'rowspan'],
            'th': ['colspan', 'rowspan', 'scope'],
            'meter': ['min', 'max', 'value', 'low', 'high', 'optimum'],
            'progress': ['max', 'value'],
            'blockquote': ['cite'],
            'q': ['cite'],
            'time': ['datetime'],
            'abbr': ['title'],
            'details': ['open'],
            'img, video, audio, iframe': ['loading', 'decoding', 'fetchpriority']
        },
        allowedSchemes: ['http', 'https', 'mailto', 'tel', 'data'],
        allowedSchemesByTag: {
            img: ['http', 'https', 'data'],
            video: ['http', 'https'],
            audio: ['http', 'https'],
            source: ['http', 'https'],
            iframe: ['http', 'https']
        },
        allowVulnerableTags: false,
        enforceHtmlBoundary: true
    });
}
