export class RegistryObject {
    status:string;
    data?:RegistrationData[] ;
    error?:NodeJS.ErrnoException;
    
    search(id:string) : RegistrationData | null {
         let obj:RegistrationData | null;
         obj = null;
         if (this.data != null){
             for(var i = 0; i < this.data.length; i++) {
                 if(this.data[i].deviceId === id){
                     obj = this.data[i];
                     break;
                 }
             }
         }
        return obj;
    }

    remove(id:string) : void {
        if (this.data != null){
             for(var i = 0; i < this.data.length; i++) {
                 if(this.data[i].deviceId === id){
                     this.data.splice(i,1);
                     break;
                 }
             }
         }
    } 
}