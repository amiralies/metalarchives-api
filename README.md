MetalArchives RESTful API
======
RESTful API for metal-archives.com written in NodeJS, express.

How to run
-------
1. Make sure you have nodejs, mongodb and git installed.

2. Clone the repo:
```sh
git clone https://github.com/amiralies/metalarchives-api.git
```

3. Install dependencies :
```sh
cd metalarchives-api 
npm install
```
4. Set env vars (do changes if necessary) :
```sh
export MONGO_URL=mongodb://localhost:27017/metalarchives
```
5. Catch database :
```sh
npm run catchDB
```

6. Start API :
```sh
npm start
```
7. Done.

Docs
-------
To generate docs follow these steps:

1. Install apidoc and run it in root of repo :
```sh
npm install -g apidoc
cd metalarchives-api
apidoc -i src/routes/
```
2. cd to ``/doc`` folder in repo.

3. Serve files with your desired http server.

4. Done.