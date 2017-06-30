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
        let path = this._datapath + data.job + '.txt';
        
        return new Promise((resolve, reject) => {
           fs.writeFile(path ,JSON.stringify(data), (err) => {
	            if (err) {
				    reject(err);
			    } else {
                    let sdata : StoreData = {        
                                status : 'Ok',
			                      data :  data.deviceId
                    }
                    resolve(sdata); 
                } 			    
		    });
       });    
    }
}