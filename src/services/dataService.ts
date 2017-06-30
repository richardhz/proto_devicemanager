import * as fs from 'fs';
import { DeviceService } from '../services/deviceService';

export class DataService {
    private _datapath:string;
    private deviceService: DeviceService;

    constructor(dataPath:string) {
        this._datapath = dataPath;
        
        this.deviceService = new DeviceService(this._datapath);
    }

    public async Store(data:DataPacket) {
        //We need to check if the device is registed
        var isRegistered = await this.deviceService.isRegistered(data.deviceId);
        let res : StoreData; 
        if(isRegistered){
           res = await this.StoreFile(data);
        } else {
            res = {status : 'notregistered', data : "" }  
        }
        return res;
         
    }

    private StoreFile(data:DataPacket): Promise<StoreData> {
        let path = this._datapath; 
        //reject not yet handled.
        //probably a better way to impliment this Promise
        return new Promise(function(resolve, reject){
          fs.writeFile(path + data.job + '.txt',JSON.stringify(data), function(err){
				      if (err) {
				        return reject(err);
			        }
            let sdata : StoreData = {        
              status : 'Ok',
			  data :  data.deviceId
            }
            
            resolve(sdata);      			    
		    });
       });    
    }
}