/*
root file for Node.js application
*/
const http = require('http');

//routes.js 불러오기 
const routes=require('./routes');//로컬 파일이니 앞에 ./붙이고 자동으로 뒤에 .js는 붙여주므로 생략가능



//방법 1
//const server = http.createServer((routes)); //routes 상수가 requestHandler 함수를 갖고 있으므로 여기서 핸들러로 사용 가능
//방법 2
const server = http.createServer((routes.handler));
console.log(routes.someText);

server.listen(3000); //포트번호(qhxhd 1000번대 다 괜찮음), 현재 사용하고 있는 가상머신(지금의 경우 localhost)
