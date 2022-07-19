const fs=require('fs');


const requestHandler=(req,res)=>{
    const url=req.url;
    const method=req.method;

    if(url==='/'){
        res.setHeader('Content-Type','text/html');
        res.write('<html>');//hml코드 전송
        res.write('<head><title>Enter Message</title></head>');
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>') //message에 post 요청을 전달함.
        res.write('</html>');
        return res.end(); //res end()를 하면 res.write() 나 set()을 하면 안되서 함수를 끝내기 위해 return사용
    }
    if(url==='/message'&&method==='POST'){
        //데이터를 보낼 때 chunk를 하나하나씩 보내기 때문에 그걸 모아주는 작업
        const body = [];
        req.on('data',(chunk)=>{
            console.log(chunk);
            body.push(chunk); //const지만 body=이 안되는 거지 push는 가능함.
        });

        //chunk작업이 완료되면 이 함수를 시작해라.
        return req.on('end',()=>{
            const parsedBody=Buffer.concat(body).toString(); //새 버퍼가 생성되고 본문 안에 있던 모든 청크가 추가됨, toString을 사용해 버퍼를 문자열로 전환
            const message=parsedBody.split('=')[1];//message=apple에서 apple만 골라내는 작업

            //새로운 txt파일을 만들어서 받아온 걸 저장함.
            fs.writeFile('message.txt',message,err=>{
                res.statusCode=302;//한번에 몇가지 메타정보를 작성할 수 있게 함. 302 완료됐다 상태코드
                res.setHeader('Location','/');
                return res.end();
            });
            
        });
    }
    res.setHeader('Content-Type','text/html');
    res.write('<html>');//hml코드 전송
    res.write('<head><title>My First Page</title></head>');
    res.write('<body><h1>Hello from my Node.js Server!</h1></body>')
    res.write('</html>');
    res.end();//응답을 끝낸 뒤에는 절대로 변경해서는 안됨.
};

//내보내는 방법 1
//module.exports=requestHandler;

//내보내는 방법 2
// module.exports={
//     handler: requestHandler,
//     someText: 'Some hard coded text'
// };

//내보내는 방법 3
exports.handler=requestHandler; // module. 생략가능
exports.someText='Some hard coded text'; //module. 생략가능
