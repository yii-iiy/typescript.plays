
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


////////////////////////////////////////////

// 莫得重试。

// const promise_unwarpper: <T>(p: PromiseLike<T> | Promise<T> | T) => Awaited<PromiseLike<T> | Promise<T> | T> = 
//     async <T,> (p: PromiseLike<T> | Promise<T> | T) => await p ;

// const promise_unwarpper_ugly: <T>(p: PromiseLike<T> | Promise<T> | T) => Awaited<PromiseLike<T> | Promise<T> | T> = 
//     <T,> (p: PromiseLike<T> | Promise<T> | T): Awaited<PromiseLike<T> | Promise<T> | T> =>
//     { 
//         let ret: T ; p.then(x=> ret=x); return ret;} ;

const unwrap_promise =
    <T,> (p: T | Promise<T> | PromiseLike<T>)
    : Awaited<T | Promise<T> | PromiseLike<T>> =>
        Promise.resolve(p).then(res => res) as Awaited<T | Promise<T> | PromiseLike<T>> ;



const pick_webhtml =
    (webmessage: {sitehost: string, mainpath: string, picker: (d: Document, p: string) => string })
    : Promise<string> => 
    {
        const pick_perhtml =
            (msg: {per_path: string, main_hostpath: string, picker: (d: Document, p: string) => string})
            : Promise<string> =>
                fetch(`https://${msg.main_hostpath}/${msg.per_path}`)
                    .then
                    ( response => response.text()
                    , reject => `<!-- [ERROR] :pick_perhtml: fetch 'https://${msg.main_hostpath}/${msg.per_path}' got reject: ${reject} -->`
                    )
                    .then(t => (new DOMParser()).parseFromString(t,"text/html"))
                    .then(document => msg.picker(document,msg.per_path) )
                    .catch(err => `<!-- [FAILED] :pick_perhtml: job on 'https://${msg.main_hostpath}/${msg.per_path}' failed: ${err} -->`)
        
        return fetch(`https://${webmessage.sitehost}/${webmessage.mainpath}`)
            .then
            ( response => response.text()
            , reject => `<!-- [ERROR] :pick_webhtml: fetch 'https://${webmessage.sitehost}/${webmessage.mainpath}' got reject: ${reject} -->` 
            )
            .then(t => (new DOMParser()).parseFromString(t,"text/html"))
            .then
            ( htmldom => 
                Array.from( htmldom.getElementsByClassName("reference internal") )
                    .map(elem => `${webmessage.mainpath}/${elem.getAttribute("href") ?? ""}`)
                    .map(pathper => {return {per_path: pathper, main_hostpath: `${webmessage.sitehost}`, picker: webmessage.picker}})
                    .map(msgper => pick_perhtml(msgper))
            )
            .then(htmparts_promising => Promise.all(htmparts_promising) )
            .then(htmparts => htmparts.reduce((x,y) => x+y))
            .then(partsfull => ["<div path=docs/current/>",partsfull,"</div>"].reduce((x,y) => x+y))
            .catch(err => `<!-- [FAILED] :pick_webhtml: job on 'https://${webmessage.sitehost}/${webmessage.mainpath}' failed: ${err} -->`)
    } ;

const trino_picker = 
    (document: Document, path: string)
    : string => 
        [ `<div path=${path} >`
        , document.getElementsByClassName("md-container")[0].outerHTML
        , document.getElementsByClassName("md-footer")[0].outerHTML
        , "</div>" ] .reduce ( (x,y) => x+y ) ;

const trino_msg = {sitehost: "trino.io", mainpath: "docs/current/", picker: trino_picker} ;

const picking = pick_webhtml(trino_msg) ;

picking.then(res => console.log(res))


///////////////////////////






