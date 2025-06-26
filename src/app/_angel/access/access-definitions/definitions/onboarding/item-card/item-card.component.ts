import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { ProfileService } from "src/app/_angel/profile/profile.service"
import { Subject, takeUntil } from "rxjs"

@Component({
    selector: "app-item-card",
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './item-card.component.html',
    styleUrl: './item-card.component.scss'
})
export class ItemCardComponent implements OnInit, OnDestroy {
    @Input() item!: any
    @Output() fetchEvent = new EventEmitter<any>();
    itemForm!: FormGroup
    submitted = false
    private ngUnsubscribe = new Subject()

    constructor(
        private fb: FormBuilder,
        private profileService: ProfileService
    ) { }


    ngOnInit(): void {
        this.itemForm = this.fb.group({
            title: [this.item.baslik, Validators.required],
            content: [this.item.metin, Validators.required],
        })
    }

    get f() {
        return this.itemForm.controls
    }

    onUpdate(): void {
        this.submitted = true

        if (this.itemForm.invalid) {
            return
        }

        const updatedItem: any[] = [{
            mkodu: 'yek343',
            id: this.item.id.toString(),
            baslik: this.itemForm.value.title,
            metin: this.itemForm.value.content,
            fotoid: null
        }];

        this.profileService.requestMethod(updatedItem).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
            next: () => {
                this.submitted = false
                this.onPut();
            },
            error: (error: any) => {
                console.error("Error updating item", error)
            },
        })
    }

    onDelete(): void {
        const sp: any[] = [{
            mkodu: 'yek342',
            id: this.item.id.toString()
        }];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
            next: (res) => {
                console.log("Silindi :", res);
                this.onPut();
            },
            error: (error: any) => {
                console.error("Error updating item", error)
            },
        })
    }

    onPut() {
        this.fetchEvent.emit();
    }
    
    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }
}
