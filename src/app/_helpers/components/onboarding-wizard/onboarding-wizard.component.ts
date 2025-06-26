import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Component({
    selector: 'app-onboarding-wizard',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule
    ],
    templateUrl: './onboarding-wizard.component.html',
    styleUrl: './onboarding-wizard.component.scss'
})
export class OnboardingWizardComponent implements OnInit, OnDestroy {
    private unsubscribe = new Subject();
    steps: any[] = [];


    currentStep = 0;
    isAnimating = false;
    animationDirection: 'forward' | 'backward' = 'forward';
    consentGiven = false;
    currentUser: any;

    ngOnInit(): void {
        this.fetchItems();
    }

    constructor(
        private router: Router,
        private auth: AuthService,
        private profileService: ProfileService
    ) {
        // Kullanıcı bilgilerini al
        this.getCurrentUserValue();

        // onboarding işlemi tamamlandı mı?
        if (this.currentUser.KVKK != null && this.currentUser.KVKK != undefined) {
            localStorage.setItem('onboarded', this.currentUser.KVKK == 1 ? 'true' : 'false')
        };


        // Eğer kullanıcı onboarding sürecini tamamlamadıysa, dashboard'a yönlendirme
        const onboarded = this.currentUser.KVKK == 1 ? true : false;
        if (onboarded) {
            this.router.navigate(['/profile']);
        }
    }


    fetchItems() {
        var sp: any[] = [
            {
                mkodu: 'yek341',
                id: '0'
            }
        ];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.unsubscribe)).subscribe((res: any) => {
            const data = res[0].x;
            const message = res[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            this.steps = this.transformApiResponseToSteps(data);
        });
    }

    transformApiResponseToSteps(apiData: any[]): any[] {
        return apiData.map((item, index) => {
          // Son elemana özel işlem (hasConsent: true)
          const isLastItem = index === apiData.length - 1;
          
          return {
            id: index + 1, // Yeni ID'ler 1'den başlayarak sıralı
            title: item.baslik,
            content: item.metin,
            hasConsent: isLastItem // Sadece son eleman için true
          };
        });
    }

    getCurrentUserValue() {
        this.currentUser = this.auth.currentUserValue;
    }

    get currentStepData() {
        return this.steps[this.currentStep];
    }

    get isFirstStep() {
        return this.currentStep === 0;
    }

    get isLastStep() {
        return this.currentStep === this.steps.length - 1;
    }

    get canProceed() {
        return !this.currentStepData.hasConsent || this.consentGiven;
    }

    nextStep() {
        if (!this.canProceed || this.isAnimating) return;

        if (this.isLastStep) {
            this.setPermissions();

            return;
        }

        this.isAnimating = true;
        this.animationDirection = 'forward';

        setTimeout(() => {
            this.currentStep++; // Adım ilerlet
            this.consentGiven = false; // Her adımda onay durumunu sıfırla
            setTimeout(() => (this.isAnimating = false), 300); // Animasyon süresi
        }, 300);
    }

    previousStep() {
        if (this.isFirstStep || this.isAnimating) return;

        this.isAnimating = true;
        this.animationDirection = 'backward';

        setTimeout(() => {
            this.currentStep--;
            this.consentGiven = false;
            setTimeout(() => (this.isAnimating = false), 300);
        }, 300);
    }

    setPermissions() {
        var sp: any[] = [
            {
                mkodu: 'yek336',
                kvkk: this.consentGiven ? "1" : "0",
            }
        ];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.unsubscribe)).subscribe((res: any) => {
            const data = res[0].x;
            const message = res[0].z;

            if (message.islemsonuc == -1) {
                console.error('Error setting permissions:', message);
                return;
            }

            console.log('Permissions set successfully:', data);
            localStorage.setItem('onboarded', 'true');
            // Onboarding tamamlandığında kullanıcıyı profile yönlendir
            console.log('Onboarding complete');
            this.router.navigate(['/profile']);
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe.next(true);
        this.unsubscribe.complete();
    }

}

