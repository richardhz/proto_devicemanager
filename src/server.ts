import { Router,Express } from 'express';
import * as express from 'express';
import { json, urlencoded } from 'body-parser';
import * as http from 'http';
import { DeviceController } from './controllers/deviceController'



export class Server {
    public app:Express;
    private port: number = 3000;
    constructor() {
        this.app = express();
        this.loadConfiguration(this.app);
        this.configureMiddleware(this.app);
        this.configureRoutes(this.app);
        
    }

    private configureMiddleware(app: Express) {
      app.use(urlencoded({ extended: true }));
      app.use(json());
    }

    private configureRoutes(app:Router){
       app.use(DeviceController.route,new DeviceController().router);
    }

    private loadConfiguration(app: Express) {
        //will move thes to a config file and use nconf
        process.env.app_datapath = './data/';
        process.env.app_regFileName = 'RegistryData.json';
        this.port = 3001;
    }
    public run() {
        let server = http.createServer(this.app);
        server.listen(this.port);
        console.log("Started on port: ", this.port);
        
    }
}

new Server().run();