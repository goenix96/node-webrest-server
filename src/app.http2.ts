import { readFileSync } from "fs";
import http2 from "http2";

const server = http2.createSecureServer(
  {
    key: readFileSync("./keys/server.key"),
    cert: readFileSync("./keys/server.crt"),
  },
  (request, response) => {
    console.log(request.url);

    //   response.writeHead(200, {
    //     "content-type": "text/html",
    //   });
    //   response.write("<h1>Hola mundo</h1>");
    //   response.end();

    //   const data = { name: "Jhon Doe", age: 30, city: "New York" };
    //   response.writeHead(200, {
    //     "content-type": "application/json",
    //   });
    //   response.end(JSON.stringify(data));
    if (request.url === "/") {
      const htmlFile = readFileSync("./public/index.html", "utf-8");
      response.writeHead(200, {
        "content-type": "text/html",
      });
      response.end(htmlFile);
      return;
    }

    if (request.url?.endsWith(".js")) {
      response.writeHead(200, {
        "content-type": "application/javascript",
      });
    } else if (request.url?.endsWith(".css")) {
      response.writeHead(200, {
        "content-type": "text/css",
      });
    }
    const responseContent = readFileSync(`./public${request.url}`, "utf-8");
    response.end(responseContent);
  }
);

server.listen(8080, () => {
  console.log("Server running...");
});
