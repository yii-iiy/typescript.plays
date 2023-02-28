fetch("https://trino.io/docs/current/")
  .then(r => r.text())
  .then(t => (new DOMParser()).parseFromString(t,"text/html"))
  .then
  (htmldom => 
    htmldom
      .getElementsByClassName("reference internal")[1]
      .getAttribute("href") ?? ""
  )
  .then((t: string) => console.log(t))
