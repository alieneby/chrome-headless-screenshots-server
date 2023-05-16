Github Homepage:
https://github.com/alieneby/chrome-headless-screenshots-server


# Chrome Headless Screenshots

Node.js script and Docker image to take screenshots of webpages with Chrome headless and [Puppeteer](https://github.com/puppeteer/puppeteer).

Pull requests are welcome.

## How to use it

### Node.js

Run `yarn install` 

or 

`npm install` 

to install all the required dependencies.



### Web Server
Start web server:

```
node server.js
```

HTTP Request to get a screenshot from a webpage with curl:

```
curl "http://localhost:3000/?url=https%3A%2F%2Fhypnose54321.de%2F&format=webp&width=1024&height=600" -o img.webp
```

After the execution, there will a picture file named "img.webp" in your folder.

Stop Server with ctrl-c or

```
curl "http://localhost:3000/screenshot/stop"
```

Optional: timeout 
Default: 4000 milliseconds (4 seconds)
Value: integer
You can add the timeout in miliseconds to url:
```
curl "http://localhost:3000/?url=https%3A%2F%alien.de%2F&format=jpeg&width=300&height=300&timeout=6000" -o img.jpg
```

Optional: waitUntil
Default: domcontentloaded
Value: 'domcontentloaded' or 'networkidle0'
Screenshot should be done when DOM content loaded or network is idle:
```
curl "http://localhost:3000/?url=https%3A%2F%alien.de%2F&format=jpeg&width=300&height=300&waitUntil=networkidle0" -o img.jpg
```

Optional: delay
Default: 2000
Value: integer 
Milliseconds after waitUntil is called.
Screenshot should be done after this delay:
```
curl "http://localhost:3000/?url=https%3A%2F%alien.de%2F&format=jpeg&width=300&height=300&waitUntil=networkidle0"&delay=3000" -o img.jpg
```

### Without web Server, just make a screenshot.
```
node index.js https://github.com
```


### Docker

You can either build your own Docker image or you can use the pre-built one `nevermendel/chrome-headless-screenshots` or `ghcr.io/nevermendel/docker-texlive-xetex`

Build the Docker image:

```
docker build -t screenshot_server/20230516 .
```

To take a screenshot with a Docker container run:

```
docker run -it -v $(pwd):/usr/src/app/out  --name screenshot_server -p 3000:3000 --rm screenshot_server
```

Stop mit CTRL-c oder mit

```
docker container ls | grep screenshot_server  
```

```
docker container stop <id> 
```


## Script usage (Without Webserver)

```
node index.js [options] <url>

Take a screenshot of a webpage

Positionals:
  url  Url of the webpage you want to take a screenshot of                                          [string]

Options:
  -h, --help         Show help                                                                     [boolean]
  -v, --version      Show version number                                                           [boolean]
      --width        Viewport width                                                 [number] [default: 1920]
      --height       Viewport height                                                [number] [default: 1080]
      --outputDir    Output directory, defaults to current directory                 [string] [default: "."]
      --filename     Filename of the produced screenshot                    [string] [default: "screenshot"]
      --inputDir     Input directory, defaults to current directory                  [string] [default: "."]
      --userAgent    User agent                                                       [string] [default: ""]
      --cookies      Cookies in json format as string                                 [string] [default: ""]
      --cookiesFile  Path of the file containing the cookies                          [string] [default: ""]
      --delay        Delay before taking the screenshot in ms                          [number] [default: 0]
      --format       Image format of the screenshot
                                                  [string] [choices: "png", "jpeg", "webp"] [default: "png"]

Examples:
  index.js https://github.com                             Take a screenshot of https://github.com and save
                                                          it as screenshot.png
  index.js --cookiesFile=cookies.json https://google.com  Load the cookies from cookies.json, take a
                                                          screenshot of https://google.com and save it as
                                                          screenshot.png
```

## License

[MIT Licence](LICENSE.md)
