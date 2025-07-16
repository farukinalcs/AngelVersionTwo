export interface ConnectionModel {
    terminalname: string;
    ClientType: number;
    ConnectionDate: string;
    ConnectionId: string;
    KullaniciAdi: string;
    LoginId: string;
    Process: string;
    CustomerCode: string;
    imei:string;
    ClientInfo: string | any; // string geliyor ama biz JSON.parse yapacağız
  }