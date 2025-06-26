import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { AuthHTTPService } from '../../services/auth-http';
import { SessionService } from 'src/app/_helpers/session.service';

@Component({
    selector: 'app-two-factor',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TranslateModule, FormsModule],
    templateUrl: './two-factor.component.html',
    styleUrls: ['./two-factor.component.scss']
})
export class TwoFactorComponent implements OnInit {
    @ViewChild('digit2') digit2!: ElementRef;
    @ViewChild('digit3') digit3!: ElementRef;
    @ViewChild('digit4') digit4!: ElementRef;
    twoFactorForm!: FormGroup;
    submitted = false;
    fa: string = '';
    email: string = '';
    phone: string = '';
    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private toastr: ToastrService,
        private sessionService: SessionService
    ) { }

    ngOnInit(): void {
        this.sessionService.stopMonitoring();

        this.fa = this.route.snapshot.queryParamMap.get('fa') || '';
        this.email = this.route.snapshot.queryParamMap.get('email') || '';
        this.phone = this.route.snapshot.queryParamMap.get('phone') || '';

        this.twoFactorForm = this.fb.group({
            digit1: ['', [Validators.required, Validators.pattern('[0-9]')]],
            digit2: ['', [Validators.required, Validators.pattern('[0-9]')]],
            digit3: ['', [Validators.required, Validators.pattern('[0-9]')]],
            digit4: ['', [Validators.required, Validators.pattern('[0-9]')]],
        });
    }

    get f() {
        return this.twoFactorForm.controls;
    }

    onSubmit(): void {
        this.submitted = true;
        if (this.twoFactorForm.invalid) {
            return;
        }

        const code = `${this.f.digit1.value}${this.f.digit2.value}${this.f.digit3.value}${this.f.digit4.value}`;

        const loginOptions = {
            code2fa: code
        };

        this.authService.login(loginOptions).subscribe({
            next: (_) => {
                if (_ == -13) {
                    console.log("Duplicate Key :", _);
                    localStorage.removeItem('token');
                    localStorage.removeItem('is-secure');
                    localStorage.removeItem('onboarded');

                    this.router.navigate(['/auth/login']);
                    this.toastr.warning('Oops!');
                    return;
                } else if (_ == -1) {
                    this.toastr.warning("Hatalı Kod Giriş", "Uyarı!");
                    this.router.navigate(['/auth/login']);
                    return;
                }



                this.authService.refreshSecureKey(code);

                this.toastr.success('Giriş başarılı!');
                this.router.navigate(['/profile']);
            },
            error: () => {
                this.toastr.error('Doğrulama kodu hatalı!');
            }
        });
    }

    moveToNext(event: Event, nextInput: HTMLInputElement | null): void {
        const input = event.target as HTMLInputElement;
        if (input.value.length === 1 && nextInput) {
            nextInput.focus();
        }
    }

    onKeyDown(event: KeyboardEvent, prevInput: HTMLInputElement | null): void {
        const input = event.target as HTMLInputElement;

        if (event.key === 'Backspace' && input.value === '' && prevInput) {
            prevInput.focus();
        }
    }



    refreshSecureKey(code: string) {
        const reversed = code.split('').reverse().join('');       // 4312
        const reversedReordered = reversed.slice(1) + reversed[0]; // 3124 (manuel istenen düzende değilse bu düzenleme yapılabilir)
        const reversedPart = reversedReordered.slice(0, 3);       // 312
        const lastThree = code.slice(-3);                         // 134
        console.log(`${code}*${reversedReordered}${reversedPart}!${lastThree}`);
    }

    handlePaste(event: ClipboardEvent): void {
        const pastedText = event.clipboardData?.getData('text') || '';
        const digits = pastedText.replace(/\D/g, '').slice(0, 4); // Sadece sayı al ve maksimum 4 hane

        if (digits.length > 0) {
            this.twoFactorForm.patchValue({
                digit1: digits[0] || '',
                digit2: digits[1] || '',
                digit3: digits[2] || '',
                digit4: digits[3] || '',
            });

            // Otomatik focus'lama istersen:
            setTimeout(() => {
                if (digits.length >= 2) this.digit2.nativeElement.focus();
                if (digits.length >= 3) this.digit3.nativeElement.focus();
                if (digits.length >= 4) this.digit4.nativeElement.focus();
            });
        }

        event.preventDefault(); // Varsayılan yapıştırma davranışını engelle
    }



}
