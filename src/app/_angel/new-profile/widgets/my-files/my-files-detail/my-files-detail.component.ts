import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

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
    state: any;
    uniqueId: string;
    contentType: any;
    extension: any;
}

interface UploadedFile {
    file: File;
    progress: number;
    status: 'uploading' | 'completed' | 'error';
}

@Component({
    selector: 'app-my-files-detail',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './my-files-detail.component.html',
    styleUrl: './my-files-detail.component.scss'
})
export class MyFilesDetailComponent implements OnInit, OnChanges, OnDestroy {
    @Input() types: any[];
    @Input() source: string;
    @Input() formId: any;
    @Output() uploadEvent = new EventEmitter<any>();

    private ngUnsubscribe = new Subject();
    documentTypes: DocumentType[] = [];

    uploadedFiles: { [key: string]: UploadedFile[] } = {};
    draggedOver: string | null = null;

    constructor(
        private profileService: ProfileService,
        private toastrService: ToastrService
    ) { }


    ngOnChanges(changes: SimpleChanges): void {
        if (changes['types']) {
            this.documentTypes = [];
            this.uploadedFiles = {};
            
            this.types.forEach((item: any) => {
                this.documentTypes.push({
                    id: item.id.toString(),
                    name: item.belgetipiad,
                    required: true,
                    acceptedFormats: ['JPG', 'PNG', 'PDF'],
                    fileId: item.belgetipiid,
                    state: item.durum,
                    uniqueId: item.UniqueId,
                    contentType: item.ContentType,
                    extension: item.DosyaTipi
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
        this.documentTypes.forEach(item => {
            if (item.id == documentId) {
                item.file = null;
            }
        });
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
        // Yüklenmiş ve completed durumdaki dosyaları say
        const filesArray: UploadedFile[][] = Object.values(this.uploadedFiles);
        const flattenedFiles: UploadedFile[] = ([] as UploadedFile[]).concat(...filesArray);
        const uploadedFilesCount = flattenedFiles.filter(file => file.status === 'completed').length;

        // State'i '1' olan dokümanları say
        const stateOneCount = this.documentTypes.filter(doc => doc.state == '1').length;

        // İkisinin toplamını dön
        return uploadedFilesCount + stateOneCount;
    }

    getTotalRequiredCount(): number {
        return this.documentTypes.filter((doc) => doc.required).length;
    }

    getRequiredCompletedCount(): number {
        return this.documentTypes.filter(
            (doc) =>
                doc.required &&
                (
                    doc.state == '1' || // state'i '1' olanları da kabul et
                    this.uploadedFiles[doc.id]?.some((file) => file.status === 'completed')
                )
        ).length;
    }

    getCompletedCountForDisable(): number {
        return this.documentTypes.filter(
            (doc) =>
                doc.required &&
                (
                    this.uploadedFiles[doc.id]?.some((file) => file.status === 'completed')
                )
        ).length;
    }

    onSendFiles() {
        console.log("Send :", this.documentTypes)
        
        this.documentTypes.forEach(doc => {
            if (doc.file && !doc.state) {
                this.setFile(doc.file, doc.fileId)                
            }
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

    show(item: DocumentType) {
        this.profileService
            .getFileForDemand(item.uniqueId, item.extension, 'sicildosya')
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((response: any) => {
                const base64Data = response[0].x; // Base64 string
                const contentType = item.contentType; // Örn: 'application/pdf', 'image/png'

                console.log('Base64 Geldi :', base64Data);

                // Base64'ü Blob'a dönüştür
                const byteCharacters = atob(base64Data.base64Data);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: contentType });

                // Blob'dan bir URL oluştur
                const blobUrl = URL.createObjectURL(blob);

                // Yeni sekmede aç
                window.open(blobUrl);

                console.log('Dosya görüntüleniyor:', blobUrl);
            });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }

}
