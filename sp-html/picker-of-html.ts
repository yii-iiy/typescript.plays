
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


const pickwebhtml =
    (webmessage: {sitehost: string, mainpath: string, picker: (d: Document, p: string) => string }) => 
    {
        const pickperhtml =
            (msg: {path: string, host: string, picker: (d: Document, p: string) => string}) =>
                fetch(`https://${msg.host}/${msg.path}`)
                    .then(r => r.text())
                    .then(t => (new DOMParser()).parseFromString(t,"text/html"))
                    .then(document => msg.picker(document,msg.path) )

        fetch(`https://${webmessage.sitehost}/${webmessage.mainpath}`)
            .then(r => r.text())
            .then(t => (new DOMParser()).parseFromString(t,"text/html"))
            .then
            (htmldom => 
                Array.from( htmldom.getElementsByClassName("reference internal") )
                    .map(elem => `${webmessage.mainpath}/${elem.getAttribute("href") ?? ""}`)
                    .map(pathper => {return {path: pathper, host: webmessage.sitehost, picker: webmessage.picker}})
                    .map(msgper => pickperhtml(msgper))
                    .reduce((x,y)=>x+y)
            )
            .then( (tg: Array<string>) => tg.forEach(t=>console.log(t) ) )
    }

// 这个还没写好，类型对不上。
// 我需要明白 TND await 到底是 TND Promise 的怎么着的语法糖。
// 不知为啥就是查不到，任何资料，查不到。

// 我的需要很简单。就是把东西取出来， fetch() 取不到就给我重试。
// 在 shell 里就是很简单的 while ! (commands paras ...); do echo retried $((t++)); done
// 或者玩儿的花一点儿就是 retrier () { "$@" || exec bash -c "(declare -f -- retrier) && retrier $(for p in "$@"; do printf %s "'$p' "; done)" ; } 这样子
// Promise 作为一个可能失败因而取不到目标值的操作没有自带的重试实现就真的很离谱。。。
