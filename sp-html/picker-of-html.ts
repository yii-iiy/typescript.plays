
const pickhtml =
    (msg: {path: string, host: string, picker: (d: Document, p: string) => string}) =>
        fetch(`https://${msg.host}/${msg.path}`)
            .then(r => r.text())
            .then(t => (new DOMParser()).parseFromString(t,"text/html"))
            .then(document => msg.picker(document,msg.path) )
            .then((t: string) => console.log(t))

/////////////////////////////////

// trino

const trino_picker = 
    (document: Document, path: string) => 
        [ `<div path=${path} >`
        , document.getElementsByClassName("md-container")[0].outerHTML
        , document.getElementsByClassName("md-footer")[0].outerHTML
        , "</div>" ]
            .reduce((x,y)=>x+y)


pickhtml({path: "docs/current/develop/event-listener.html", host: "trino.io", picker: trino_picker})
