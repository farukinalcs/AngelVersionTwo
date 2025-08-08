import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ColDef, ColGroupDef, ColumnApi, GridApi, GridOptions, ICellRendererParams, IRowNode, IsRowSelectable, RowHeightParams, SideBarDef, StatusPanelDef } from 'ag-grid-enterprise';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { FilterChangedEvent, GridReadyEvent } from 'ag-grid-community';
import { OrganizationColumnFilterComponent } from 'src/app/_angel/attendance/organization-column-filter/organization-column-filter.component';
import { ThemeModeService } from 'src/app/_metronic/partials/layout/theme-mode-switcher/theme-mode.service';
import { ToastrService } from 'ngx-toastr';
import { AG_GRID_LOCALE_TR } from '@ag-grid-community/locale';

@Component({
    selector: 'app-expected-visitor',
    standalone: true,
    imports: [CommonModule, FormsModule, AgGridModule],
    templateUrl: './expected-visitor.component.html',
    styleUrl: './expected-visitor.component.scss'
})
export class ExpectedVisitorComponent implements OnInit, OnDestroy, OnChanges {
    private ngUnsubscribe = new Subject();
    @Input() selectedTab: any = {};
    @Input() refresh: boolean;
    @Output() updateEmit = new EventEmitter<any>();
    @Output() selectedVisitor = new EventEmitter<any>();
    @ViewChild('agGridLight', { static: false }) agGridLight: AgGridAngular;
    @ViewChild('agGridDark', { static: false }) agGridDark: AgGridAngular;
    gridHeight = '80vh';
    gridStyle: any = {
        height: this.gridHeight,
        flex: '1 1 auto',
    };
    public defaultColDef: ColDef = {
        minWidth: 70,
        filter: true,
        floatingFilter: true,
        sortable: true,
        resizable: true,
        editable: false,
        menuTabs: [],
    };
    public rowSelection: 'single' | 'multiple' = 'multiple';
    public isRowSelectable: IsRowSelectable = (params: IRowNode<any>) => {
        return !!params.data && params.data.year >= 2012;
    };
    public rowData: any[] = [];
    public sideBar: SideBarDef | string | string[] | boolean | null = {
        toolPanels: [
            'filters',
            {
                id: 'columns',
                labelDefault: 'Columns',
                labelKey: 'columns',
                iconKey: 'columns',
                toolPanel: 'agColumnsToolPanel',
                toolPanelParams: {
                    suppressRowGroups: true,
                    suppressValues: true,
                    suppressPivots: true,
                    suppressPivotMode: true,
                },
            },
        ],
    };
    public rowGroupPanelShow: 'always' | 'onlyWhenGrouping' | 'never' = 'always';
    public statusBar: { statusPanels: StatusPanelDef[]; } = {
        statusPanels: [
            { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
            { statusPanel: 'agTotalRowCountComponent', align: 'center' },
            { statusPanel: 'agFilteredRowCountComponent' },
            { statusPanel: 'agSelectedRowCountComponent' },
            { statusPanel: 'agAggregationComponent' },
        ],
    };
    gridOptions: GridOptions = {
        localeText: AG_GRID_LOCALE_TR, // Türkçe dil desteği
        context: {
            handleExitButtonClick: this.handleExitButtonClick.bind(this),
            handleRepeatButtonClick: this.handleRepeatButtonClick.bind(this),
        }
    };
    public columnDefs: (ColDef | ColGroupDef)[];
    loading: boolean = false;
    filterFromModal: boolean = false;
    savedFilterModel: any;

    activeTheme: 'light' | 'dark' = 'light'; // Varsayılan tema
    gridApi!: GridApi;
    columnApi!: ColumnApi;
    isDarkMode = false; // Varsayılan olarak light mode

    formIdColorMap: { [formId: string]: string } = {};
    availableColors: string[] = [
        '#FFEBEE', // light red
        '#FFF3E0', // light orange
        '#E8F5E9', // light green
        '#E3F2FD', // light blue
        '#F3E5F5', // light purple
        '#FCE4EC', // light pink
        '#E0F2F1', // light teal
        '#F9FBE7', // light lime
        '#FBE9E7', // peach
        '#EDE7F6', // lavender
        '#F1F8E9', // mint
        '#FFFDE7', // very light yellow
        '#E0F7FA', // aqua
        '#F8BBD0', // pale rose
        '#DCEDC8', // pale green
        '#D1C4E9', // pale violet
        '#BBDEFB', // pale sky blue
        '#FFECB3', // butter
        '#B2EBF2', // baby blue
        '#C8E6C9', // light moss
    ];

    colorIndex = 0;
    imageUrl: string = "";


    constructor(
        private profileService: ProfileService,
        private translateService: TranslateService,
        private themeModeService: ThemeModeService,
        private ref: ChangeDetectorRef,
        private toastrService: ToastrService
    ) {
        this.imageUrl = this.profileService.getImageUrl();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['refresh']) {
            if (this.selectedTab.type == '3') {
                this.fetchCustomCodes();
                this.getList();
            }
        }
    }

    ngOnInit(): void {
        this.columnDefs = [
            {
                headerName: '#',
                colId: 'checkbox',
                pinned: 'left',
                minWidth: 30,
                maxWidth: 30,
                headerCheckboxSelection: true,
                headerCheckboxSelectionFilteredOnly: true,
                filter: false,
                checkboxSelection: true,
                hide: false,
            },
            //Kişi Bilgileri
            {
                headerName: this.translateService.instant('Kişi_Bilgileri'),
                marryChildren: true,
                headerClass: 'person-group',
                groupId: 'PersonInfoGroup',
                hide: false,
                children: [
                    {
                        headerName: this.translateService.instant('Id'),
                        field: 'Id',
                        headerTooltip: this.translateService.instant('Id'),
                        type: 'numericColumn',
                        filter: false,
                        hide: false,
                    },
                    {
                        headerName: this.translateService.instant('Ad'),
                        field: 'Ad',
                        headerTooltip: this.translateService.instant('Ad'),
                        filter: 'agTextColumnFilter',
                        filterParams: {
                            buttons: ['reset', 'apply'],
                            textMatcher: ({ filterOption, value, filterText }: {
                                filterOption: string;
                                value: string;
                                filterText: string;
                            }) => {
                                return true;
                            },
                        },
                        cellClass: (params) => this.applyLinkClass(),
                        hide: false,
                        onCellDoubleClicked: (params) => this.clickedVisitor(params),
                    },
                    {
                        headerName: this.translateService.instant('Soyad'),
                        field: 'Soyad',
                        headerTooltip: this.translateService.instant('Soyad'),
                        filter: 'agTextColumnFilter',
                        filterParams: {
                            buttons: ['reset', 'apply'],
                            textMatcher: ({ filterOption, value, filterText }: {
                                filterOption: string;
                                value: string;
                                filterText: string;
                            }) => {
                                return true;
                            },
                        },
                        hide: false,
                    }
                ],
            },

            //Ziyaret Bilgileri
            {
                headerName: this.translateService.instant('Ziyaret_Bilgileri'),
                headerClass: 'organization-group',
                marryChildren: true,
                groupId: 'organizationGroup',
                hide: false,
                children: [
                    {
                        colId: 'Firma',
                        headerName: this.translateService.instant('Firma'),
                        field: 'Firma',
                        headerTooltip: this.translateService.instant('Firma_Adı'),
                        rowGroup: false,
                        enableRowGroup: true,
                        hide: false,
                        filter: 'agTextColumnFilter',
                    },
                    {
                        colId: 'cbo_ziyaretnedeni',
                        headerName: this.translateService.instant('Ziyaret Nedeni'),
                        field: 'ZiyaretNedeni',
                        headerTooltip: this.translateService.instant('Ziyaret Nedeni'),
                        rowGroup: false,
                        enableRowGroup: true,
                        hide: false,
                        filter: OrganizationColumnFilterComponent,
                    },
                    {
                        colId: 'ziyaretsahibi',
                        headerName: this.translateService.instant('Kime Geldi'),
                        field: 'ziyaretsahibi',
                        headerTooltip: this.translateService.instant('Kime Geldi'),
                        rowGroup: false,
                        enableRowGroup: true,
                        hide: false,
                        filter: 'agTextColumnFilter',
                        cellRenderer: (params: any) => {
                            const sicilid = params?.data?.SicilId;
                            const name = params?.value || '';
                            const imageUrl = sicilid
                                ? `${this.imageUrl}?sicilid=${sicilid}`
                                : '';

                            return `
                                <div class="d-flex align-items-center gap-1">
                                    <img 
                                    src="${imageUrl}" 
                                    style="width: 23px; height: 23px; border-radius: 5px; object-fit: cover;"
                                    />
                                    <span>${name}</span>
                                </div>
                                `;
                        }
                    }


                ],
            },

            //Özel Bilgileri
            {
                headerName: this.translateService.instant('Özel Kod Bilgiler'),
                marryChildren: true,
                headerClass: 'custom-code',
                groupId: 'CustomCodeGroup',
                hide: false,
                children: [
                    {
                        headerName: this.translateService.instant('Özel Kod 1'),
                        field: 'ZOKod1',
                        headerTooltip: this.translateService.instant('Özel Kod 1'),
                        filter: 'agTextColumnFilter',
                        filterParams: {
                            buttons: ['reset', 'apply'],
                            textMatcher: ({ filterOption, value, filterText }: {
                                filterOption: string;
                                value: string;
                                filterText: string;
                            }) => {
                                return true;
                            },
                        },
                        valueFormatter: params => {
                            const value = params.value;
                            return value ? value : '-- boş --';
                        },
                        cellClass: params => {
                            return !params.value ? 'empty-cell' : '';
                        },
                        hide: false
                    },
                    {
                        headerName: this.translateService.instant('Özel Kod 2'),
                        field: 'ZOKod2',
                        headerTooltip: this.translateService.instant('Özel Kod 2'),
                        filter: 'agTextColumnFilter',
                        filterParams: {
                            buttons: ['reset', 'apply'],
                            textMatcher: ({ filterOption, value, filterText }: {
                                filterOption: string;
                                value: string;
                                filterText: string;
                            }) => {
                                return true;
                            },
                        },
                        valueFormatter: params => {
                            const value = params.value;
                            return value ? value : '-- boş --';
                        },
                        cellClass: params => {
                            return !params.value ? 'empty-cell' : '';
                        },
                        hide: false
                    },
                    {
                        headerName: this.translateService.instant('Özel Kod 3'),
                        field: 'ZOKod3',
                        headerTooltip: this.translateService.instant('Özel Kod 3'),
                        filter: 'agTextColumnFilter',
                        filterParams: {
                            buttons: ['reset', 'apply'],
                            textMatcher: ({ filterOption, value, filterText }: {
                                filterOption: string;
                                value: string;
                                filterText: string;
                            }) => {
                                return true;
                            },
                        },
                        valueFormatter: params => {
                            const value = params.value;
                            return value ? value : '-- boş --';
                        },
                        cellClass: params => {
                            return !params.value ? 'empty-cell' : '';
                        },
                        hide: false
                    },
                    {
                        headerName: this.translateService.instant('Özel Kod 4'),
                        field: 'ZOKod4',
                        headerTooltip: this.translateService.instant('Özel Kod 4'),
                        filter: 'agTextColumnFilter',
                        filterParams: {
                            buttons: ['reset', 'apply'],
                            textMatcher: ({ filterOption, value, filterText }: {
                                filterOption: string;
                                value: string;
                                filterText: string;
                            }) => {
                                return true;
                            },
                        },
                        valueFormatter: params => {
                            const value = params.value;
                            return value ? value : '-- boş --';
                        },
                        cellClass: params => {
                            return !params.value ? 'empty-cell' : '';
                        },
                        hide: false
                    },
                    {
                        headerName: this.translateService.instant('Özel Kod 5'),
                        field: 'ZOKod5',
                        headerTooltip: this.translateService.instant('Özel Kod 5'),
                        filter: 'agTextColumnFilter',
                        filterParams: {
                            buttons: ['reset', 'apply'],
                            textMatcher: ({ filterOption, value, filterText }: {
                                filterOption: string;
                                value: string;
                                filterText: string;
                            }) => {
                                return true;
                            },
                        },
                        valueFormatter: params => {
                            const value = params.value;
                            return value ? value : '-- boş --';
                        },
                        cellClass: params => {
                            return !params.value ? 'empty-cell' : '';
                        },
                        hide: false
                    },
                    {
                        headerName: this.translateService.instant('Özel Kod 6'),
                        field: 'ZOKod6',
                        headerTooltip: this.translateService.instant('Özel Kod 6'),
                        filter: 'agTextColumnFilter',
                        filterParams: {
                            buttons: ['reset', 'apply'],
                            textMatcher: ({ filterOption, value, filterText }: {
                                filterOption: string;
                                value: string;
                                filterText: string;
                            }) => {
                                return true;
                            },
                        },
                        valueFormatter: params => {
                            const value = params.value;
                            return value ? value : '-- boş --';
                        },
                        cellClass: params => {
                            return !params.value ? 'empty-cell' : '';
                        },
                        hide: false
                    },
                    {
                        headerName: this.translateService.instant('Özel Kod 7'),
                        field: 'ZOKod7',
                        headerTooltip: this.translateService.instant('Özel Kod 7'),
                        filter: 'agTextColumnFilter',
                        filterParams: {
                            buttons: ['reset', 'apply'],
                            textMatcher: ({ filterOption, value, filterText }: {
                                filterOption: string;
                                value: string;
                                filterText: string;
                            }) => {
                                return true;
                            },
                        },
                        valueFormatter: params => {
                            const value = params.value;
                            return value ? value : '-- boş --';
                        },
                        cellClass: params => {
                            return !params.value ? 'empty-cell' : '';
                        },
                        hide: false
                    },
                    {
                        headerName: this.translateService.instant('Özel Kod 8'),
                        field: 'ZOKod8',
                        headerTooltip: this.translateService.instant('Özel Kod 8'),
                        filter: 'agTextColumnFilter',
                        filterParams: {
                            buttons: ['reset', 'apply'],
                            textMatcher: ({ filterOption, value, filterText }: {
                                filterOption: string;
                                value: string;
                                filterText: string;
                            }) => {
                                return true;
                            },
                        },
                        valueFormatter: params => {
                            const value = params.value;
                            return value ? value : '-- boş --';
                        },
                        cellClass: params => {
                            return !params.value ? 'empty-cell' : '';
                        },
                        hide: false
                    },
                    {
                        headerName: this.translateService.instant('Özel Kod 9'),
                        field: 'ZOKod9',
                        headerTooltip: this.translateService.instant('Özel Kod 9'),
                        filter: 'agTextColumnFilter',
                        filterParams: {
                            buttons: ['reset', 'apply'],
                            textMatcher: ({ filterOption, value, filterText }: {
                                filterOption: string;
                                value: string;
                                filterText: string;
                            }) => {
                                return true;
                            },
                        },
                        valueFormatter: params => {
                            const value = params.value;
                            return value ? value : '-- boş --';
                        },
                        cellClass: params => {
                            return !params.value ? 'empty-cell' : '';
                        },
                        hide: false
                    },
                    {
                        headerName: this.translateService.instant('Özel Kod 10'),
                        field: 'ZOKod10',
                        headerTooltip: this.translateService.instant('Özel Kod 10'),
                        filter: 'agTextColumnFilter',
                        filterParams: {
                            buttons: ['reset', 'apply'],
                            textMatcher: ({ filterOption, value, filterText }: {
                                filterOption: string;
                                value: string;
                                filterText: string;
                            }) => {
                                return true;
                            },
                        },
                        valueFormatter: params => {
                            const value = params.value;
                            return value ? value : '-- boş --';
                        },
                        cellClass: params => {
                            return !params.value ? 'empty-cell' : '';
                        },
                        hide: false
                    },
                    {
                        headerName: this.translateService.instant('Özel Kod 11'),
                        field: 'ZOKod11',
                        headerTooltip: this.translateService.instant('Özel Kod 11'),
                        filter: 'agTextColumnFilter',
                        filterParams: {
                            buttons: ['reset', 'apply'],
                            textMatcher: ({ filterOption, value, filterText }: {
                                filterOption: string;
                                value: string;
                                filterText: string;
                            }) => {
                                return true;
                            },
                        },
                        valueFormatter: params => {
                            const value = params.value;
                            return value ? value : '-- boş --';
                        },
                        cellClass: params => {
                            return !params.value ? 'empty-cell' : '';
                        },
                        hide: false
                    },
                    {
                        headerName: this.translateService.instant('Özel Kod 12'),
                        field: 'ZOKod12',
                        headerTooltip: this.translateService.instant('Özel Kod 12'),
                        filter: 'agTextColumnFilter',
                        filterParams: {
                            buttons: ['reset', 'apply'],
                            textMatcher: ({ filterOption, value, filterText }: {
                                filterOption: string;
                                value: string;
                                filterText: string;
                            }) => {
                                return true;
                            },
                        },
                        valueFormatter: params => {
                            const value = params.value;
                            return value ? value : '-- boş --';
                        },
                        cellClass: params => {
                            return !params.value ? 'empty-cell' : '';
                        },
                        hide: false
                    }

                ],
            },

            // Diğer Bilgileri
            {
                headerName: this.translateService.instant('Diğer_Bilgiler'),
                marryChildren: true,
                headerClass: 'other-group',
                groupId: 'otherGroup',
                hide: false,
                children: [


                    {
                        headerName: this.translateService.instant('Plaka'),
                        field: 'Plaka',
                        headerTooltip: this.translateService.instant('Plaka'),
                        filter: 'agTextColumnFilter',
                        filterParams: {
                            buttons: ['reset', 'apply'],
                            textMatcher: ({ filterOption, value, filterText }: {
                                filterOption: string;
                                value: string;
                                filterText: string;
                            }) => {
                                return true;
                            },
                        },
                        hide: false,
                    },
                    {
                        headerName: this.translateService.instant('Giriş Tarihi'),
                        field: 'Giris',
                        headerTooltip: this.translateService.instant('Giriş Tarihi'),
                        filter: false,
                        hide: false,
                        valueFormatter: (params) => {
                            if (params.value) {
                                const date = new Date(params.value);
                                const day = String(date.getDate()).padStart(2, '0');
                                const month = String(date.getMonth() + 1).padStart(2, '0');
                                const year = date.getFullYear();
                                const hours = String(date.getHours()).padStart(2, '0');
                                const minutes = String(date.getMinutes()).padStart(2, '0');
                                const seconds = String(date.getSeconds()).padStart(2, '0');
                                return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
                            }
                            return '';
                        },
                    },
                    {
                        headerName: this.translateService.instant('Çıkış Tarihi'),
                        field: 'Cikis',
                        headerTooltip: this.translateService.instant('Çıkış Tarihi'),
                        filter: false,
                        hide: false,
                        // cellRendererSelector: (params: ICellRendererParams<any>) => {
                        //     const exitSystem = {
                        //         component: ExitDateRenderer,
                        //         params: {
                        //             data: params.data,
                        //         },
                        //     };
                        //     return exitSystem
                        // },
                        minWidth: 160,
                        maxWidth: 160,
                    },

                    {
                        headerName: this.translateService.instant('Kaydeden'),
                        field: 'duzenleyen',
                        headerTooltip: this.translateService.instant('Kaydeden'),
                        filter: 'agTextColumnFilter',
                        filterParams: {
                            buttons: ['reset', 'apply'],
                            textMatcher: ({ filterOption, value, filterText }: {
                                filterOption: string;
                                value: string;
                                filterText: string;
                            }) => {
                                return true;
                            },
                        },
                        hide: false,
                        cellRenderer: (params: any) => {
                            const sicilid = params?.data?.duzenleyenid;
                            const name = params?.value || '';
                            const imageUrl = sicilid
                                ? `${this.imageUrl}?sicilid=${sicilid}`
                                : '';

                            return `
                                <div class="d-flex align-items-center gap-1">
                                    <img 
                                    src="${imageUrl}" 
                                    style="width: 23px; height: 23px; border-radius: 5px; object-fit: cover;"
                                    />
                                    <span>${name}</span>
                                </div>
                                `;
                        }
                    },
                    {
                        headerName: this.translateService.instant('Açıklama'),
                        field: 'Bilgi',
                        headerTooltip: this.translateService.instant('Açıklama'),
                        filter: 'agTextColumnFilter',
                        filterParams: {
                            buttons: ['reset', 'apply'],
                            textMatcher: ({ filterOption, value, filterText }: {
                                filterOption: string;
                                value: string;
                                filterText: string;
                            }) => {
                                return true;
                            },
                        },
                        hide: false,
                    },
                ],
            },
        ];

        this.getTheme(); // Tema moduna subscribe olunup dinlemeye başlanıyor
        // this.getList();
    }


    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
    }

    getList() {
        const today = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(today.getFullYear() - 1);

        const formatDate = (date: Date): string => {
            return date.toISOString().split('T')[0]; // "YYYY-MM-DD" formatında döndürür
        };

        // savedFilterModel'in gerçekten dolu olup olmadığını kontrol eden fonksiyon
        const isObjectEmpty = (obj: any) => obj && Object.keys(obj).length === 0;

        this.rowData = [];
        this.loading = true;
        // this.loadingEvent.emit(true);

        var sp: any[] = [
            {
                mkodu: 'yek374',
                id: '0',
                ziyarettipi: savedFilterModel?.cbo_ziyaretnedeni?.toString() || '0',
                ziyaretbaslik: savedFilterModel?.Ad?.filter || '',
                ziyaretplaka: savedFilterModel?.Plaka?.filter || '',
                ziyaretsoyad: savedFilterModel?.Soyad?.filter || '',
                kime: savedFilterModel?.ziyaretsahibi?.filter || '',
                firma: savedFilterModel?.Firma?.filter || '',
                tarih: formatDate(today),
                tarihbit: !savedFilterModel || isObjectEmpty(savedFilterModel) ? formatDate(today) : formatDate(oneYearAgo),
            }
        ];

        console.log("Beklenen Ziyaretçi Params: ", sp);

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
            const data = response[0].x;
            const message = response[0].z;

            if (message.islemsonuc == -1) {
                return;
            }
            console.log("Beklenen Ziyaretçi Listesi Geldi: ", data);


            this.rowData = [...this.rowData, ...data];
            this.rowData.forEach((row: any) => {
                row.rowHeight = 30;
            });

            this.assignColorsToFormIds(this.rowData);

            this.loading = false;

            // Tüm kolonları içeriğe göre otomatik ayarla
            setTimeout(() => {
                this.autoSizeAllColumns();
            }, 100);

        }, (error: any) => {
            console.log("Ziyaretçi Listesi Hatası: ", error);
            this.loading = false;
        });
    }

    assignColorsToFormIds(rowData: any[]): void {
        this.formIdColorMap = {};
        this.colorIndex = 0;

        rowData.forEach(row => {
            const formId = row.formid;

            if (!this.formIdColorMap[formId]) {
                // Renk döngüsü yap, biterse tekrar başa dön
                this.formIdColorMap[formId] = this.availableColors[this.colorIndex % this.availableColors.length];
                this.colorIndex++;
            }
        });
    }

    getRowStyle = (params: any) => {
        const formId = params.data?.formid;
        const backgroundColor = this.formIdColorMap[formId];
        const textColor = this.getTextColor(backgroundColor);

        return {
            backgroundColor,
            color: textColor,
        };
    };

    getTextColor(bgColor: string): string {
        if (!bgColor) return '#000';
        const r = parseInt(bgColor.substr(1, 2), 16);
        const g = parseInt(bgColor.substr(3, 2), 16);
        const b = parseInt(bgColor.substr(5, 2), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 150 ? '#000' : '#fff';
    }




    onSelectionChanged() {
        const grid = this.getActiveGrid();
        if (grid) {
            const selectedRows = grid.api.getSelectedRows();
            console.log('Seçilenler:', selectedRows);
        }
    }

    getRowHeight(params: RowHeightParams): number | undefined | null {
        return params?.data?.rowHeight;
    }

    handleExitButtonClick(data: any) {
        // Çıkış Ver butonuna tıklanınca yapılacak işlemler burada olacak
        console.log('Çıkış Ver butonuna tıklandı', data);
        // Burada gerekli işlemleri yapabilirsiniz
        var sp: any[] = [
            { mkodu: 'yek271', id: data.Id.toString() }
        ];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
            const data = response[0].x;
            const message = response[0].z;

            if (message == -1) {
                return;
            }

            console.log("Ziyaretçi Çıkışı Verildi :", data);
            this.toastrService.success(this.translateService.instant('Ziyaretçi Çıkışı Verildi'), this.translateService.instant('Başarılı'));
            this.getList();
        });
    }

    handleRepeatButtonClick(data: any) {
        // Yinele butonuna tıklanınca yapılacak işlemler burada olacak
        console.log('Yinele butonuna tıklandı', data);
        // Burada gerekli işlemleri yapabilirsiniz
        var sp: any[] = [
            { mkodu: 'yek271', id: data.Id.toString() }
        ];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
            const data = response[0].x;
            const message = response[0].z;

            if (message == -1) {
                return;
            }

            console.log("Ziyaretçi Çıkışı Verildi :", data);
            this.toastrService.success(this.translateService.instant('Ziyaretçi Çıkışı Verildi'), this.translateService.instant('Başarılı'));
            this.getList();
        });
    }

    getActiveGrid() {
        return this.activeTheme === 'light' ? this.agGridLight : this.agGridDark;
    }


    autoSizeAllColumns() {
        if (this.columnApi) {
            const allColumnIds: string[] = ['duzenleyen', 'Bilgi', 'Plaka', 'Giris', 'ziyaretsahibi', 'KimlikTipiAd', 'ZiyaretNedeni', 'Kimlikno', 'Firma', 'Ad', 'Soyad', 'Id', 'ZOKod1', 'ZOKod2', 'ZOKod3', 'ZOKod4', 'ZOKod5', 'ZOKod6', 'ZOKod7', 'ZOKod8', 'ZOKod9', 'ZOKod10', 'ZOKod11', 'ZOKod12'];
            this.columnApi.getColumns()?.forEach((column) => {
                allColumnIds.push(column.getId());
            });
            this.columnApi.autoSizeColumns(allColumnIds, false); // False: İçeriğe göre en küçük hale getir
        }
    }


    onGridReadyLight(params: GridReadyEvent) {
        if (this.activeTheme === 'light') {
            this.gridApi = params.api;
            this.columnApi = params.columnApi;

            // Tüm kolonları içeriğe göre otomatik ayarla
            setTimeout(() => {
                this.autoSizeAllColumns();
            }, 100);
        }
    }

    onGridReadyDark(params: GridReadyEvent) {
        if (this.activeTheme === 'dark') {
            this.gridApi = params.api;
            this.columnApi = params.columnApi;

            // Tüm kolonları içeriğe göre otomatik ayarla
            setTimeout(() => {
                this.autoSizeAllColumns();
            }, 100);
        }
    }

    setActiveGridApis() {
        const grid = this.activeTheme === 'light' ? this.agGridLight : this.agGridDark;
        if (grid) {
            this.gridApi = grid.api;
            this.columnApi = grid.columnApi;
        }
    }

    changeTheme(theme: 'light' | 'dark') {
        this.activeTheme = theme;
        setTimeout(() => this.setActiveGridApis(), 0);  // Grid render olduktan sonra al
    }

    onFilterChanged(e: FilterChangedEvent) {
        if (this.activeTheme === 'light') {
            savedFilterModel = this.gridApi.getFilterModel();
            console.log('SavedFilterModel: ', savedFilterModel);

            this.savedFilterModel = savedFilterModel;
            this.getList();
        }
    }


    getTheme() {
        this.themeModeService.mode.pipe(takeUntil(this.ngUnsubscribe)).subscribe((mode: any) => {
            this.changeTheme(mode);
        });
    }

    applyLinkClass() {
        return "text-danger fw-bolder text-decoration-underline link-style"
    }

    clickedVisitor(params: any) {
        this.selectedVisitor.emit(params.data);
        this.updateEmit.emit();
    }

    fetchCustomCodes() {
        var sp: any = [
            {
                mkodu: 'yek284'
            }
        ];


        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
            const data: any[] = response[0].x;
            const message = response[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            console.log("Özel Kod Değerleri Geldi :", data);

            // zokod başlıklarını güncellemek içiin
            this.updateSpecialCodeColumnDefs(data);

        });
    }

    updateSpecialCodeColumnDefs(codeList: any[]) {
        const customCodeGroup = this.columnDefs.find(col =>
            'groupId' in col && col.groupId === 'CustomCodeGroup'
        );

        if (!customCodeGroup || !('children' in customCodeGroup)) return;

        customCodeGroup.children.forEach(column => {
            // ColDef olduğundan emin ol
            if ('field' in column) {
                const match = codeList.find(code => code.ad === column.field);
                if (match) {
                    column.headerName = match.deger;
                    column.headerTooltip = match.deger;
                }
            }
        });

        this.gridApi?.setColumnDefs(this.columnDefs);
    }




    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }
}
var savedFilterModel: any = null;
