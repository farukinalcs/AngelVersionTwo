import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HelperService } from 'src/app/_helpers/helper.service';

@Injectable({
  providedIn: 'root'
})

export class SignalrPatrolService {
  private hubConnection!: signalR.HubConnection;

  constructor( private helperService : HelperService) { }

  // public startConnection(): void {
  //   this.hubConnection = new signalR.HubConnectionBuilder()
  //     .withUrl('https://mecloud.com.tr:8011/angelhub') // Backend adresi buraya
  //     .withAutomaticReconnect()
  //     .build();

  //   this.hubConnection
  //     .start()
  //     .then(() =>
  //       {
  //         console.log('SignalR bağlantısı kuruldu.');
        

  //         this.registerToServer({
  //           userId: "233",
  //           adSoyad: "string",
  //           kullaniciAdi: "string",
  //           tokenId: this.helperService.gateResponseY,
  //           loginId: "233",
  //           customerCode: 'MeyerTakip14367',
  //           clientType: 44,
  //           accessToken: this.helperService.gateResponseY,
  //           clientInfo: '{"AppName": "M5ServiceRD", "IpAddr": "10.20.24.27"}'
      
  //         })
        
  //       }
  //   )
  //     .catch(err => console.error('SignalR bağlantı hatası:', err));
  // }

  
  // public addTransferChartDataListener(callback: (data: any) => void): void {
  //   this.hubConnection.on('ReceiveMessage', callback);
  // }

  // public sendMessage(user: string, message: string): void {
  //   this.hubConnection.invoke('SendMessage', user, message)
  //     .catch(err => console.error(err));
  // }

  // public getPatrolInfo(locationId: number): void {
  //   this.hubConnection.invoke('GetPatrolInfo', locationId)
  //     .catch(err => console.error('GetPatrolInfo hatası:', err));
  // }

  // public onReceivePatrolInfo(callback: (data: any) => void): void {
  //   this.hubConnection.on('ReceivePatrolInfo', callback);
  // }

  // public async registerToServer(data: {
  //   userId: string;
  //   adSoyad: string;
  //   kullaniciAdi: string;
  //   tokenId: string;
  //   loginId: string;
  //   customerCode?: string;
  //   clientType?: number;
  //   accessToken?: string;
  //   clientInfo?:string;
  // }): Promise<void> {
  //   if (!this.hubConnection) return;
  
  //   const payload = {
  //     ...data,
  //     customerCode: data.customerCode || 'MeyerTakip14367',
  //     clientType: data.clientType ?? 44,
  //     tokenId: data.tokenId || this.helperService.gateResponseY,
  //     accessToken: data.accessToken || this.helperService.gateResponseY,
  //     clientInfo: '{AppName : "M5ServiceRD", IpAddr : "10.20.24.27"}'
  //   };
    
  //   try {
  //     await this.hubConnection.invoke('register',payload );
  //     console.log('✅ Register işlemi başarılı:', payload);
  //   } catch (err) {
  //     console.error('❌ Register işlemi başarısız:', err);
  //   }

  // }
}
