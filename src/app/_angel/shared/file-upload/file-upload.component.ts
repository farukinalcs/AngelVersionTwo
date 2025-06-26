import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProfileService } from '../../profile/profile.service';
import { Subject, takeUntil } from 'rxjs';

interface DocumentType {
    id: string;
    name: string;
    description?: string;
    icon?: string; // icon sınıf adı
    required: boolean;
    maxSize?: string;
    acceptedFormats: string[];
    fileId: number;
    file?: any;
}

interface UploadedFile {
    file: File;
    progress: number;
    status: 'uploading' | 'completed' | 'error';
}

@Component({
    selector: 'app-file-upload',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './file-upload.component.html',
    styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent implements OnInit, OnChanges, OnDestroy {
    @Input() types: any[];
    @Input() source: string;
    @Input() formId: any;
    @Output() uploadEvent = new EventEmitter<any>();

    private ngUnsubscribe = new Subject();
    documentTypes: DocumentType[] = [
        // {
        //     id: 'identity',
        //     name: 'Kimlik Belgesi',
        //     description: 'T.C. Kimlik Kartı ön ve arka yüzü',
        //     icon: 'bi-person-vcard',
        //     required: true,
        //     maxSize: '5MB',
        //     acceptedFormats: ['JPG', 'PNG', 'PDF']
        // },
        // {
        //     id: 'license',
        //     name: 'Ehliyet Belgesi',
        //     description: 'Sürücü belgesi ön ve arka yüzü',
        //     icon: 'bi-credit-card',
        //     required: true,
        //     maxSize: '5MB',
        //     acceptedFormats: ['JPG', 'PNG', 'PDF']
        // },
        // {
        //     id: 'marriage',
        //     name: 'Evlilik Cüzdanı',
        //     description: 'Evlilik cüzdanı fotokopisi',
        //     icon: 'bi-heart',
        //     required: false,
        //     maxSize: '5MB',
        //     acceptedFormats: ['JPG', 'PNG', 'PDF']
        // },
        // {
        //     id: 'education',
        //     name: 'Eğitim Belgesi',
        //     description: 'Diploma veya mezuniyet belgesi',
        //     icon: 'bi-mortarboard',
        //     required: true,
        //     maxSize: '10MB',
        //     acceptedFormats: ['JPG', 'PNG', 'PDF']
        // },
        // {
        //     id: 'work',
        //     name: 'İş Belgesi',
        //     description: 'İş yerinden alınan çalışma belgesi',
        //     icon: 'bi-building',
        //     required: false,
        //     maxSize: '5MB',
        //     acceptedFormats: ['JPG', 'PNG', 'PDF']
        // },
        // {
        //     id: 'other',
        //     name: 'Diğer Belgeler',
        //     description: 'Ek belgeler (varsa)',
        //     icon: 'bi-file-image',
        //     required: false,
        //     maxSize: '10MB',
        //     acceptedFormats: ['JPG', 'PNG', 'PDF']
        // }
    ];

    uploadedFiles: { [key: string]: UploadedFile[] } = {};
    draggedOver: string | null = null;
    merged: any[] = [];

    constructor(
        private profileService: ProfileService
    ) { }
    

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['types']) {
            this.types.forEach((item: any) => {
                this.documentTypes.push({
                    id: item.id.toString(),
                    name: item.ad,
                    required: true,
                    acceptedFormats: ['JPG', 'PNG', 'PDF'],
                    fileId: item.BelgeId
                });
            });
        }
    }

    ngOnInit(): void {

    }

    handleDrop(event: DragEvent, documentId: string) {
        event.preventDefault();
        this.draggedOver = null;
        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
            this.handleFileUpload(documentId, files);
        }
    }

    handleDragOver(event: DragEvent, documentId: string) {
        event.preventDefault();
        this.draggedOver = documentId;
    }

    handleDragLeave(event: DragEvent) {
        event.preventDefault();
        this.draggedOver = null;
    }

    handleFileUpload(documentId: string, fileList: FileList) {
        const doc = this.documentTypes.find(item => item.id == documentId);
        const newFiles: UploadedFile[] = Array.from(fileList).map((file) => ({
            file,
            progress: 0,
            status: 'uploading',
            name: doc?.name,
            fileId: doc?.fileId
        }));

        if (!this.uploadedFiles[documentId]) {
            this.uploadedFiles[documentId] = [];
        }

        this.uploadedFiles[documentId].push(...newFiles);

        newFiles.forEach((uploadFile, index) => {
            const interval = setInterval(() => {
                if (uploadFile.progress < 100) {
                    uploadFile.progress += 10;
                } else {
                    uploadFile.status = 'completed';
                    clearInterval(interval);
                }
            }, 200);
        });

        this.documentTypes = this.documentTypes.map(type => {
            const matchingItem = this.uploadedFiles[documentId].find((file: any) => file.fileId == type.fileId);

            return matchingItem ? { ...type, file: matchingItem.file } : type;
        });

        console.log("Uploaded Files: ", this.uploadedFiles);
        console.log("Doc : ", this.documentTypes);

    }

    removeFile(documentId: string, index: number) {
        this.uploadedFiles[documentId]?.splice(index, 1);
    }


    triggerFileInput(doc: DocumentType): void {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = doc.acceptedFormats.map(f => '.' + f.toLowerCase()).join(',');
        input.onchange = (e: Event) => {
            const target = e.target as HTMLInputElement;
            const files = target.files;
            if (files) {
                this.handleFileUpload(doc.id, files);
            }
        };
        input.click();
    }

    isCompleted(documentId: string): boolean {
        return this.uploadedFiles[documentId]?.some(f => f.status === 'completed') ?? false;
    }

    getCompletedCount(): number {
        const filesArray: UploadedFile[][] = Object.values(this.uploadedFiles);
        const flattenedFiles: UploadedFile[] = ([] as UploadedFile[]).concat(...filesArray);
        return flattenedFiles.filter(file => file.status === 'completed').length;
    }

    getTotalRequiredCount(): number {
        return this.documentTypes.filter((doc) => doc.required).length;
    }

    getRequiredCompletedCount(): number {
        return this.documentTypes.filter(
            (doc) =>
                doc.required &&
                this.uploadedFiles[doc.id]?.some((file) => file.status === 'completed')
        ).length;
    }

    onSendFiles() {
        this.documentTypes.forEach(doc => {
            this.setFile(doc.file, doc.fileId)
        });
    }

    setFile(file: any, fileType: any) { // API'ye, Oluşturulan İzin Talebi İçin Yüklenen Dosyaları İleten Kısım 
        this.profileService.postFileForDemand(file, this.formId, this.source, fileType)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((response: any) => {

                console.log(`${this.source} için dosya gönderildi : `, response);
                this.uploadEvent.emit();
            });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }

}
