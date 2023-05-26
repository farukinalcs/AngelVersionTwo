import { AddressModel } from './address.model';
import { SocialNetworksModel } from './social-networks.model';

export class UserModel {
  altfirmaad : any;
  direktorlukad : any;
  pozisyonad : any;
  yakaad : any;
  yetkigrubu : any;
  firmaad : any;
  customerName : any;
  gorevad : any;
  bolumad : any;
  loginname : any;
  fotoimage : any;
  tokenid : string;
  id: number;

  username: string;
  password: string;
  fullname: string;
  email: string;
  pic: string;
  roles: number[];
  occupation: string;
  companyName: string;
  phone: string;
  address?: AddressModel;
  socialNetworks?: SocialNetworksModel;


  setUser(user: any) {
    this.firmaad = user.firmaad;
    this.customerName = user.customerName;


    this.altfirmaad = user.altfirmaad;
    this.pozisyonad = user.pozisyonad;
    this.yakaad = user.yakaad;
    this.yetkigrubu = user.yetkigrubu;
    
    this.direktorlukad = user.direktorlukad;
    this.gorevad = user.gorevad;
    this.bolumad = user.bolumad;
    this.fotoimage = user.fotoimage;
    this.loginname = user.loginname;
    this.tokenid = user.tokenid;
    this.id = user.id;
    this.username = user.username || '';
    this.password = user.password || '';
    this.fullname = user.fullname || '';
    this.email = user.email || '';
    this.pic = user.pic || './assets/media/avatars/blank.png';
    this.roles = user.roles || [];
    this.occupation = user.occupation || '';
    this.companyName = user.companyName || '';
    this.phone = user.phone || '';
    this.address = user.address;
    this.socialNetworks = user.socialNetworks;
  }
}

