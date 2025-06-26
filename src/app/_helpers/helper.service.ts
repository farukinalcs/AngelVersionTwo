import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HelperService {
    gateResponseX: any;
    gateResponseY: any;
    customerCode: any;
    userLoginModel: any;
    loginOptions: any = {
        loginName: "",
        password: "",
        langcode: "",
        appcode: "",
        mkodu: ''
    };
    yetki: any[];
    lang = new Subject;
    configureComponentBehavior: BehaviorSubject<any> = new BehaviorSubject<any>(1);


    // Access Dashboard için terminal gruplarını tutan BehaviorSubject
    private dataSource = new BehaviorSubject<any>(null); // Başlangıç değeri null
    currentData$ = this.dataSource.asObservable(); // Bunu componentlerde dinleyeceğiz
    // -----


    constructor() { }

    updateData(data: any) {
        this.dataSource.next(data); // Yeni veri gönder
    }

}