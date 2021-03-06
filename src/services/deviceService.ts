import * as fs from 'fs';
import { RegistryObject } from '../infrastructure/registryObject';

export class DeviceService {
    private _datapath:string;

    constructor(dataPath:string) {
        this._datapath = dataPath;
    }

    async getDevices() {
        return await this.readRegistry();
    }

    async isRegistered(deviceId:string): Promise<boolean> {
       let device : RegistrationData | null; 
       let registryObj:RegistryObject = await this.readRegistry();
       if(registryObj.status == 'Fail'){
           console.log("Registry ",registryObj.error);
           device = null;
       } 
       device = registryObj.search(deviceId);
       
       return (device != null && device.registered);
    }

    async register(data:DataPacket) : Promise<StoreData> {
          let returnData :StoreData;
          returnData = {status : 'Fail',data : 'problem with registry object'};
          let registryObj:RegistryObject = await this.readRegistry();
          if(registryObj.status === 'Ok') {
              let newDevice:RegistrationData = {deviceId : data.deviceId,registered : true};
              if (registryObj.data === undefined) {
                  registryObj.data = [];
              }
              registryObj.data.push(newDevice);
              var result = await this.saveRegistry(registryObj);
              
              if(result){  
                   returnData = {status : 'Ok',data : data.toString()};
              } else {
                  returnData = {status : 'Fail',data : 'registry update failed'};
              }
          }
          return returnData;
    }

    async remove(deviceId:string) : Promise<StoreData> {
          let returnData :StoreData;
          returnData = {status : 'Fail',data : 'problem with registry object'};
          let registryObj:RegistryObject = await this.readRegistry();
          if(registryObj.status === 'Ok') {
               console.log('DB ',JSON.stringify(registryObj.data));
              registryObj.remove(deviceId);
              var result = await this.saveRegistry(registryObj);

              if(result){  
                   returnData = {status : 'Ok',data : deviceId};
              } else {
                  returnData = {status : 'Fail',data : 'registry update failed'};
              }
          }
           return returnData;
    }

    private saveRegistry(registryObj:RegistryObject) : Promise<boolean> {
        let path = this._datapath  + process.env.app_regFileName; 
        return new Promise((resolve,reject) => {
           fs.writeFile(path,JSON.stringify(registryObj.data), (err) => {
				    if (err) {
				       reject(false);
			        } else {
                       resolve(true); 
                    }		    
		      });
       });
    }

    private readRegistry() : Promise<RegistryObject> {
        let path = this._datapath  + process.env.app_regFileName; 
        let registry = new RegistryObject();
        
        return new Promise((resolve, reject) => {
          fs.readFile(path, (err,data) => {
				    if (err) {
                        registry.error = err;
				        resolve(registry);
			        } else {
                        registry.status = 'Ok';
			            registry.data =  JSON.parse(data.toString());
                        resolve(registry);  
                    }		    
		      });
       });    
    }
}