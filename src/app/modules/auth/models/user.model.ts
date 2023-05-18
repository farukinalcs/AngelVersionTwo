import { AuthModel } from './auth.model';
import { AddressModel } from './address.model';
import { SocialNetworksModel } from './social-networks.model';

export class UserModel extends AuthModel {
  // id: number;
  // username: string;
  // password: string;
  // fullname: string;
  // email: string;
  // pic: string;
  // roles: number[] = [];
  // occupation: string;
  // companyName: string;
  // phone: string;
  // address?: AddressModel;
  // socialNetworks?: SocialNetworksModel;


  // firstname: string;
  // lastname: string;
  // website: string;


  // language: string;
  // timeZone: string;
  // communication: {
  //   email: boolean;
  //   sms: boolean;
  //   phone: boolean;
  // };

  // emailSettings?: {
  //   emailNotification: boolean;
  //   sendCopyToPersonalEmail: boolean;
  //   activityRelatesEmail: {
  //     youHaveNewNotifications: boolean;
  //     youAreSentADirectMessage: boolean;
  //     someoneAddsYouAsAsAConnection: boolean;
  //     uponNewOrder: boolean;
  //     newMembershipApproval: boolean;
  //     memberRegistration: boolean;
  //   };
  //   updatesFromKeenthemes: {
  //     newsAboutKeenthemesProductsAndFeatureUpdates: boolean;
  //     tipsOnGettingMoreOutOfKeen: boolean;
  //     thingsYouMissedSindeYouLastLoggedIntoKeen: boolean;
  //     newsAboutMetronicOnPartnerProductsAndOtherServices: boolean;
  //     tipsOnMetronicBusinessProducts: boolean;
  //   };


  // };
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

  
  // setUser(_user: unknown) {
  //   const user = _user as UserModel;
  //   this.id = user.id;
  //   this.username = user.username || '';
  //   this.password = user.password || '';
  //   this.fullname = user.fullname || '';
  //   this.email = user.email || '';
  //   this.pic = user.pic || './assets/media/avatars/blank.png';
  //   this.roles = user.roles || [];
  //   this.occupation = user.occupation || '';
  //   this.companyName = user.companyName || '';
  //   this.phone = user.phone || '';
  //   this.address = user.address;
  //   this.socialNetworks = user.socialNetworks;
  // }
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

