import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

@Component({
    selector: 'app-new-item',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, DialogModule, TranslateModule],
    templateUrl: './new-item.component.html',
    styleUrl: './new-item.component.scss'
})
export class NewItemComponent implements OnInit, OnDestroy {
    @Input() display: boolean;
    @Output() closeEvent = new EventEmitter<any>();
    private ngUnsubscribe = new Subject()
    newItemForm!: FormGroup
    submitted = false

    constructor(
        private fb: FormBuilder,
        private profileService: ProfileService,
    ) { }

    ngOnInit(): void {
        this.initForm()
    }

    get f() {
        return this.newItemForm.controls
    }

    initForm(): void {
        this.newItemForm = this.fb.group({
            title: ["", Validators.required],
            content: ["", Validators.required],
        })
    }

    onSave(): void {
        this.submitted = true

        if (this.newItemForm.invalid) {
            return
        }

        const newItem: any[] = [{
            mkodu: 'yek340',
            baslik: this.newItemForm.value.title,
            metin: this.newItemForm.value.content,
            fotoid: null
        }];

        this.profileService.requestMethod(newItem).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
            next: (res) => {
                const data = res[0].x;
                const message = res[0].z;

                if (message.islemsonuc == -1) {
                    return;
                }
                
                this.newItemForm.reset()
                this.submitted = false
                this.closeAction(true);
            },
            error: (error:any) => {
                console.error("Error adding item", error)
            },
        })
    }

    closeAction(added?: boolean) {
        this.closeEvent.emit(added || undefined);
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }
}
