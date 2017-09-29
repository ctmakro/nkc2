# nkc2

![bannerlogo](/resources/site_specific/kclogo_umaru1_nc.png)

nkc community project, version 2.
Will always be under development.

## Recruitment

We are no longer recruiting. @ctmakro If you wanna make friend with me. Leave me alone if you have an idea for the next Facebook.

## Why this is written in English

说相同语言的人能够更好地相互沟通，形成更高的生产力，所以人总是倾向于与说相同语言的人组成联盟。秦始皇统一文字，近代中国推行普通话，皆是维护国家统一的良策。

当今世界，国国之间是友好还是敌对，首先取决于语言，其次才是资源。从苏联VS美国，到今天的俄罗斯VS北约，究其原因，是两派民众语言不通，加上双方对各类媒体的审查监管，使得两派民众无法互通情感，更无法实现互相理解，皆以动刀动枪为荣。北朝鲜民众对外部世界充满敌视，对金氏家族万般支持，使其得以穷兵黩武，装疯卖拐，人民水深火热。反观日本，专注西化100年，文化发达，科技进步，国力强盛，人民幸福。

学习英文，既非崇洋媚外，亦非卖国求荣。只求与世界最富强之国民互相理解，以助推中华崛起；与世界最先进之科学技术并驾齐驱，以造福炎黄子孙。

## License

You are allowed to use these files for any purpose.
The author of these files shall not be held responsible for any terrorist attacks or global climate changes caused by the use of these files.

## Reading list
- Web Framework: **Express 4**
- Template Language: **Jade** (now called Pug. Best template language, ever)
- Database: **ArangoDB 3.0+** (best of NoSQL)
- Image Processing: **ImageMagick** (one and only)
- Frontend Framework: Raw JavaScript + **React** (Admin Panel), need `Promise` support in browser (supports IE after Polyfilling)
- Search: **ElasticSearch 5.0.0**

## Security Updates

- 20160514: ImageMagick was found to contain security exploits that provides
  remote execution capabilities to hackers.
  Make sure you are using the latest version of ImageMagick (7.0.1-3 as for now), otherwise please do upgrade immediately.

## Recommended way to install dependencies
- ImageMagick
  - Windows

    Official Site Download.
  - OS X

    `brew install ImageMagick`
  - CentOS

    check `scripts` directory.

- ArangoDB
  - Windows

    Installer.
  - OSX

    Installer. run **ArangoDB-CLI.app** directly from **Applications**.
  - CentOS

    check `scripts` directory. Change the version number when necessary.


## How to implement an API

1. (If the API is for data modification/retrieval) Visit __localhost:8529__. Learn AQL basics from ArangoDB Official Documentation. Write AQL. Test to see if your query works.
2. Implement the API function in JavaScript. Please refer to `nkc_modules/api_operations/example.js`.
3. Make sure the current user has `'dev'` certificate (can call every API once implemented). To allow users with other certificates to call that API, Modify `permissions.js`.
4. Reload Server.

## How to call an API
- In browser
  ````html
  <script src='/interface_common.js'/>
  <script>
    nkcAPI('exampleOperation',{someParameter:'someValue'})
    .then(jalert)
    .catch(jalert)
  </script>
  ````

- In general

  An HTTP request should be made with cookies (for User Authentication) to `/api/operation`, with JSON body.
  ````javascript
  {
    "operation":"nameOfOperation",
    "someParameter":"someValue"
  }
  ````

## Future plans
- dedicated API engine with key authentication(currently by cookies)

## To Get Started
1. Install Node.js, ImageMagick for your system and make sure `npm` and `magick` are available as commands from CLI.
2. `git clone` this project, or extract from zip, to somewhere nice
3. `npm update` there for the dependencies
4. Make sure ArangoDB is listening on __localhost:8529__, then run __db_restore.command__ from Finder (OS X: may need `chmod +x` first) or `sh db_restore.command` (UNIX) to load the database from JSON files
5. run __run_as_dev.bat__ or __run_as_dev.command__ to start the server in a CLI environment
6. Press **Enter** in terminal window whenever to restart server. You may also visit `server:port/reload` to do the same


## 这样开始
1. 为你的操作系统安装Node.js 和 ImageMagick，并确保 `npm` 与 `convert` 命令在命令行中可用
2. 通过 `git clone` 或者zip解压将本项目弄到某处
3. 在该处 `npm update` 以获取依赖项
4. 确保 ArangoDB 在 __localhost:8529__ 监听, 然后从Finder运行 __db_restore.command__ (OS X: 可能需要先 `chmod +x`) 或者 `sh db_restore.command` (UNIX) 以将JSON文件载入数据库
5. 运行 __run_as_dev.bat__ or __run_as_dev.command__ 以从命令行启动服务器
6. 在命令行窗口中随时按下 **Enter** 就可以重启服务器。 你也可以访问 `server:port/reload` 实现同样效果

## Deployment
0. Do all above and make sure things does work
1. Install the forever package: `npm install forever -g`
2. Bash: `sh run_as_production.sh` Windows CMD: `run_as_production.sh`(or doubleclick)
3. Report bugs when necessary.

## For your convenience
- `scripts` directory contains various scripts to accelerate deployment
- by default listens on __localhost:1086__
- `server_settings.js` includes several globally used server parameters and static serving routes and URL rewrites
- GET `server:port/html/jade/somename` will respond with rendered `/nkc_modules/jade/somename.jade`
- Every unrouted path will end up returning 404.jade
- `query_functions.js` is the database wrapper
- `api_functions.js` contains all the API functions. They are called before serving API/HTML requests
- `im_functions.js` contains wrapper for ImageMagick binaries.

## On ElasticSearch
- `node elasticDaemon.js` to start a REPL
- setupIndex() to delete all indexed documents from ES, then recreate the index, then mark all threads in ArangoDB as unindexed
- enableIndexing() to start copying documents from ArangoDB into ES

## Redis
- `使用Redis数据库储存验证码 Redis版本号2.8.24，外部模块储存于package文件夹
