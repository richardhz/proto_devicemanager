import {Router,Request,Response, NextFunction } from 'express';
import { DataService } from '../services/dataService';
import { DeviceService } from '../services/deviceService';


export class DeviceController {
    public static route:string = '/device';
    public router: Router = Router();
    
    constructor(){   
        this.router.get('/',this.getDevices);
        this.router.post('/Register', this.register);
        this.router.post('/Store', this.store);
        this.router.post('/Remove', this.remove);
    }

    private async getDevices(req:Request,res:Response,next:NextFunction){
        let deviceService = new DeviceService(process.env.app_datapath);
        var devices = await deviceService.getDevices();
        if(devices.status === 'Ok') {
           res.status(200).send(devices.data);
        } else {
           res.status(404).send(devices.error); 
        }
    }

    private async register(req:Request,res:Response,next:NextFunction){
        let deviceService = new DeviceService(process.env.app_datapath);
        let data = req.body;
        let result = await deviceService.register(data);  //should check if device is already registered.
        if(result.status === 'Ok') {
            res.status(200).send(result);
        } else {
            res.status(500).send(result);
        }
    }

    private async remove(req:Request,res:Response,next:NextFunction){
        let deviceService = new DeviceService(process.env.app_datapath);
        let data = req.body;
        let result = await deviceService.remove(data.deviceId);
        if(result.status === "Fail") {
           res.status(403).send(result.data);
        } else {
            res.status(200).send(result);
        }
        
    }

    private async store(req:Request,res:Response,next:NextFunction){
        
        let storeService = new DataService(process.env.app_datapath);
        let data = req.body;
        let result = await storeService.Store(data);
        if(result.status === "notregistered") {
           res.status(403).send("notregistered");
        } else {
            res.status(200).send(result);
        }
       
    }

    
}