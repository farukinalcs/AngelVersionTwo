import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { Subject, take, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { MovementChange, MovementDelete } from '../store/wizard-form.state';
import { Store } from '@ngrx/store';
import { addPersonnel, removePersonnelMovement, setSelectedAction, updatePersonnelMovements } from '../store/wizard-form.actions';
import { selectPersonnelRequestById, selectSelectedAction } from '../store/wizard-form.selectors';

@Component({
    selector: 'app-attendance-action',
    standalone: true,
    imports: [CommonModule, FormsModule, DialogModule, TranslateModule, CheckboxModule],
    templateUrl: './attendance-action.component.html',
    styleUrl: './attendance-action.component.scss'
})
export class AttendanceActionComponent implements OnInit, OnDestroy {
    private ngUnsubscribe = new Subject();

    @Input() display: boolean = false;
    @Output() closeEvent = new EventEmitter<void>();
    @Input() selectedAction: any;
    @Input() employee: any;
    @Input() imageUrl: string;


    movements: any[] = [];

    ngOnInit(): void {
        this.addPerson();
        this.onActionSelect(this.selectedAction)
        this.fetchMovements();
    }

    constructor(
        private profileService: ProfileService,
        private store: Store
    ) { }

    fetchMovements(): void {
        var sp: any[] = [
            {
                mkodu: 'yek110',
                sid: this.employee.sicilid.toString(),
                tarihbas: this.employee.mesaibas.split('T')[0],
                tarihbit: this.employee.mesaibit.split('T')[0],
            }
        ];


        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
            next: (response: any) => {
                const data = response[0].x;
                const message = response[0].z;

                if (message.islemsonuc == -1) return;

                console.log('Hareketler Alındı:', data);
                this.movements = [...data];



                this.initializeCheckedMovements();
            },
            error: (error: any) => {
                console.error('Hareketler Alınırken Hata Oluştu:', error);
            }
        });

    }


    getActionTitle(): string {
        switch (this.selectedAction) {
            case 'change_direction':
                return 'Hareket Yönü Değiştir';
            case 'delete_movement':
                return 'Hareket Sil';
            default:
                return 'Hareket İşlemi';
        }
    }

    getActionDescription(): string {
        switch (this.selectedAction) {
            case 'change_direction':
                return 'Değiştirmek istediğiniz hareketleri seçin. Giriş hareketleri çıkış, çıkış hareketleri giriş olarak değiştirilecek.';
            case 'delete_movement':
                return 'Silmek istediğiniz hareketleri seçin.';
            default:
                return '';
        }
    }

    getNewMovementType(currentType: string): string {
        return currentType === 'giriş' ? 'çıkış' : 'giriş';
    }

    getMovement(id: number): any {
        return this.employee?.movements?.find((m: any) => m.id === id);
    }


    close() {
        this.closeEvent.emit();
        this.display = false;
    }

    onChange(event: any, movement: any): void {
        console.log("Event: ", event);
        if (event.checked) {
            if (this.selectedAction == 'change_direction') {
                this.onChangeDirectionClick(movement);
            } else {
                this.onDeleteMovementClick(movement);
            }
        } else {
            this.onUndoClick(movement, this.selectedAction == 'change_direction' ? 'change' : this.selectedAction == 'delete_movement' ? 'delete' : 'add');
        }


    }

    get checkedCount(): number {
        const count = this.movements.filter((item: any) => item.checked);

        return count.length;
    }

    onChangeDirectionClick(item: any) {
        const newDirection: any = item.pdks == '1' ? '2' : '1';

        const movement: MovementChange = {
            id: item.Id,
            originalType: item.pdks,
            newType: newDirection
        };

        this.store.dispatch(updatePersonnelMovements({
            personnelId: this.employee.sicilid,
            changes: {
                changeMovements: [movement]
            }
        }));
    }

    onDeleteMovementClick(item: any) {
        const movement: MovementDelete = {
            id: item.Id
        };

        this.store.dispatch(updatePersonnelMovements({
            personnelId: this.employee.sicilid,
            changes: {
                deleteMovements: [movement]
            }
        }));
    }

    initializeCheckedMovements() {
        this.store.select(selectPersonnelRequestById(this.employee.sicilid)).pipe(take(1)).subscribe(data => {
            if (!data) return;

            // Seçilen aksiyonu store'dan almak yerine parametre olarak da verebilirsin
            this.store.select(selectSelectedAction).pipe(take(1)).subscribe(selectedAction => {
                let affectedIds: string[] = [];

                if (selectedAction === 'change_direction') {
                    affectedIds = data.changeMovements?.map(m => m.id) || [];
                } else if (selectedAction === 'delete_movement') {
                    affectedIds = data.deleteMovements?.map(m => m.id) || [];
                }

                const idSet = new Set(affectedIds);

                this.movements = this.movements.map(movement => ({
                    ...movement,
                    checked: idSet.has(movement.Id) // dikkat: büyük harfli Id!
                }));
            });
        });
    }


    onActionSelect(action: any) {
        this.store.dispatch(setSelectedAction({ action }));
    }

    addPerson() {
        // Personel store'da yoksa ekle
        this.store.select(selectPersonnelRequestById(this.employee.sicilid)).pipe(take(1)).subscribe(existing => {
            if (!existing) {
                this.store.dispatch(addPersonnel({
                    personnel: {
                        personnelId: this.employee.sicilid,
                        fullName: this.employee.adsoyad
                    }
                }));
            }
        });
    }

    onUndoClick(item: any, type: 'change' | 'delete' | 'add') {
        this.store.dispatch(removePersonnelMovement({
            personnelId: this.employee.sicilid,
            movementType: type,
            movementId: item.Id
        }));
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }
}
