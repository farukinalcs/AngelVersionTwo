import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss'
})
export class GeneralComponent implements OnInit{
  private profileService = inject(ProfileService);
   private ngUnsubscribe = new Subject();
ngOnInit(): void {

this.getList();
    
}

getList():void{
      const sp: any[] = [{ mkodu: 'yek432' }];
      this.profileService
        .requestMethod(sp)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (res: any) => {
            const data = (res?.[0]?.x ?? []) as any[];
            const message = res?.[0]?.z;
            if (message?.islemsonuc === -1) return;
           console.log(data);
           
          },
          error: () => {

          },
        });
}
}
