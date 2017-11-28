const axios = require('axios');
const exec = require('child_process').exec;

function getAllLinks(url) {
  return new Promise((resolve, reject) => {
    axios.get(url)
    .then((response) => {
      const { data } = response;
      const regexp = /http:\/\/www.oreilly.com(.*\/free\/.*).csp/g
      const out = data.match(regexp);
      const out2 = out.map(e => {
        return e.replace('free', 'free/files').replace('csp','pdf')
      });
      resolve(out2);
    })
  })
}

const allLinks = [
  'http://www.oreilly.com/programming/free/', 
  'http://www.oreilly.com/business/free/',
  'http://www.oreilly.com/data/free/',
  'http://www.oreilly.com/iot/free/',
  'http://www.oreilly.com/security/free/',
  'http://www.oreilly.com/web-platform/free/',
  'http://www.oreilly.com/webops/free/ '
];

const retrieveAll = allLinks.map((l) => getAllLinks(l));

Promise.all(retrieveAll)
  .then((allR) => {
    allR.forEach(l1 => {
      l1.forEach(l2 => {
        const cmd = `wget ${l2} -O out/${l2.split('/files/')[1]}`;
        exec(cmd);
      })
    })
  })