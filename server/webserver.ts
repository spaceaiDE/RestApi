import express from 'express'

class WebServer {

    private port: number
    private application: express.Application

    constructor(port?: number) {
        this.port = (port) ? port : 8080
        this.application = express()

        this.application.use(express.json())
        this.application.use(express.urlencoded({
            extended: true
        }))
    }

    _application(): express.Application {
        return this.application
    }

    listen(): void {
        this.application.listen(this.port, () => {
            console.log(`Server is now listening on port ${this.port}`)
        })
    }

}

export {
    WebServer
}