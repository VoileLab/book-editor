import JSZip from "jszip"

import { Book } from "./book"

/*
Generate epub book like this:
.
├── META-INF
│   └── container.xml
├── OEBPS
│   ├── content.opf
│   ├── id1.xhtml
│   ├── id2.xhtml
│   ├── id3.xhtml
│   ├── nav.xhtml
│   ├── stylesheet.css
│   └── toc.ncx
└── mimetype
*/


/**
* Content for `OEBPS/stylesheet.css`
*/
const CSS = `
body {
    color: black;
}`

/**
* Content for `META-INF/container.xml`
*/
const CONTAINER = `<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
    <rootfiles>
        <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml" />
    </rootfiles>
</container>
`


/**
 * Return content for `OEBPS/content.opf`
 * @param {string} language 
 * @param {string} uuid
 * @param {Book} book
 * @param {string[]} images
 */
function genMetaData(language, uuid, book, images) {
    return `<?xml version="1.0"?>
<package version="3.0" xml:lang="en" xmlns="http://www.idpf.org/2007/opf"
    unique-identifier="book-id">
    <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
        <dc:identifier id="book-id">urn:uuid:${uuid}</dc:identifier>
        <meta refines="#book-id" property="identifier-type" scheme="xsd:string">uuid</meta>
        <meta property="dcterms:modified">2000-03-24T00:00:00Z</meta>
        <dc:language>${language}</dc:language>
        <dc:title>${book.meta.title}</dc:title>
        <dc:creator>${book.meta.author}</dc:creator>
        <dc:description>${book.meta.description}</dc:description>
        ${book.meta.bookCover ? '<meta name="cover" content="cover-img"/>' : ''}
    </metadata>
    <manifest>
        ${book.content.idList.map((contentID) => `
        <item id="${contentID}" href="${contentID}.xhtml" media-type="application/xhtml+xml" />
        `).join('')}
        <item id="toc" href="toc.ncx" media-type="application/x-dtbncx+xml" />
        <item id="nav" href="nav.xhtml" properties="nav" media-type="application/xhtml+xml" />
        <item id="css" href="stylesheet.css" media-type="text/css" />
        ${book.meta.bookCover ? '<item id="cover-img" href="cover.jpg" media-type="image/jpeg" properties="cover-image"/>' : ''}
        ${images.map((img, index) => `
        <item href="${img}" id="img-${index}" media-type="image/jpeg"/>
        `).join('')}
    </manifest>
    <spine toc="toc">
        <itemref idref="nav" />
        ${book.content.idList.map((contentID) => `
        <itemref idref="${contentID}" />
        `).join('')}
    </spine>
</package>
`
}


/**
 * Return content for `OEBPS/toc.ncx`
 * @param {string} uuid 
 * @param {Book} book
 */
function genTOC(uuid, book) {
    return `<?xml version="1.0"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
    <head>
        <meta name="dtb:uid" content="urn:uuid:${uuid}"/>
        <meta name="dtb:depth" content="1"/>
        <meta name="dtb:totalPageCount" content="0"/>
        <meta name="dtb:maxPageNumber" content="0"/>
    </head>
    <docTitle>
        <text>${book.meta.title}</text>
    </docTitle>
    <navMap>
        ${book.content.idList.map((contentID, index) => `
        <navPoint id="navpoint-${index + 1}" playOrder="${index + 1}">
            <navLabel>
                <text>${book.content.data[contentID].title}</text>
            </navLabel>
            <content src="${contentID}.xhtml"/>
        </navPoint>
        `).join('')}
    </navMap>
</ncx>
`
}

/**
 * Return content for `OEBPS/nav.xhtml`
 * @param {Book} book
 */
function genNav(book) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en" xmlns:epub="http://www.idpf.org/2007/ops">
	<head>
		<meta charset="utf-8"></meta>		
        <title>Table of contents</title>
		<link rel="stylesheet" type="text/css" href="stylesheet.css" class="day" title="day"/> 
	</head>
	<body>
		<nav epub:type="toc" id="toc">
			<ol>
                ${book.content.idList.map((contentID) => `
                <li>
                    <a href="${contentID}.xhtml">${book.content.data[contentID].title}</a>
                </li>
                `).join('')}
			</ol>
		</nav>
	</body>
</html>`
}

/**
 * Generate html content for novel chapter
 * @param {*} data 
 */
function genContent(data, imgsPath) {
    return `<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>${data.title}</title>
        <link type="text/css" rel="stylesheet" href="stylesheet.css" />
    </head>
    <body>
        <h1>${data.title}</h1>
        ${imgsPath.map((p) => `<img src="${p}"/>`).join('')}
        <div>
            ${data.content.split('\n').map((s) => `
            <p>${s}</p>
            `).join('')}
        </div>
    </body>
    </html>
    `
}

/**
 * To make a blob of an epub
 * @param {Book} book
 */
export async function makeEpub(book) {
    var zip = new JSZip();
    zip.file('mimetype', 'application/epub+zip')

    const uuid = 'B9B412F2-CAAD-4A44-B91F-A375068478A0'

    zip.file('META-INF/container.xml', CONTAINER)

    if (book.meta.bookCover) {
        const base64Response = await fetch(book.meta.bookCover)
        zip.file(`OEBPS/cover.jpg`, await base64Response.blob())
    }

    // Set the table of contents for the book
    zip.file('OEBPS/toc.ncx', genTOC(uuid, book))

    zip.file('OEBPS/nav.xhtml', genNav(book))

    // Add the text of the book to the ZIP file
    zip.file('OEBPS/stylesheet.css', CSS)

    const images = []
    for (const contentID of book.content.idList) {
        const data = book.content.data[contentID]

        const imgsPath = []
        for (const i in data.imgs) {
            const base64Img = data.imgs[i]
            const base64Response = await fetch(base64Img)
            const imgFilename = `${contentID}-${i}.jpg`
            zip.file(`OEBPS/imgs/${imgFilename}`, await base64Response.blob())
            imgsPath.push(`./imgs/${imgFilename}`)
            images.push(`imgs/${imgFilename}`)
        }

        zip.file(`OEBPS/${contentID}.xhtml`, genContent(data, imgsPath))
    }

    zip.file('OEBPS/content.opf', genMetaData('zh-TW', uuid, book, images))

    // Generate a downloadable EPUB file from the ZIP file
    return await zip.generateAsync({ type: 'blob' })
}
