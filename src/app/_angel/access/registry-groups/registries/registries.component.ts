import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { _, ColumnApi, FilterChangedEvent, FilterModifiedEvent, FilterOpenedEvent, GridOptions, GridReadyEvent, RowHeightParams } from 'ag-grid-community';
import { ColDef, ColGroupDef, IMultiFilterParams, IRowNode, IsRowSelectable, SideBarDef, StatusPanelDef, ValueFormatterParams, GridApi } from 'ag-grid-enterprise';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ThemeModeService } from 'src/app/_metronic/partials/layout/theme-mode-switcher/theme-mode.service';
import { AttendanceService } from 'src/app/_angel/attendance/attendance.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrganizationColumnFilterComponent } from 'src/app/_angel/attendance/organization-column-filter/organization-column-filter.component';
import { Register } from 'src/app/store/models/register.state';
import { Store } from '@ngrx/store';
import { selectAllRegisters } from 'src/app/store/selectors/register.selector';
import { loadRegistersFailure, loadRegistersSuccess } from 'src/app/store/actions/register.action';
import { AgGridModule } from 'ag-grid-angular';
import { AG_GRID_LOCALE_TR } from '@ag-grid-community/locale';

@Component({
    selector: 'app-registries',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        AgGridModule
    ],
    templateUrl: './registries.component.html',
    styleUrl: './registries.component.scss'
})
export class RegistriesComponent implements OnInit, OnDestroy, OnChanges {
    private ngUnsubscribe = new Subject();
    @Output() filterEvent = new EventEmitter<any>();
    @Input() filter: any; // Filtre modelini almak için
    @Input() groupId: number; // Grup ID'si
    @Input() triggered: boolean;
    @Input() selectedDetail: any; // Seçilen detay bilgisi
    @Input() editTriggered: boolean; // Edit tetikleyici
    @Output() editEvent = new EventEmitter<any>();
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
        menuTabs: ['filterMenuTab'],
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

    public columnDefs: (ColDef | ColGroupDef)[];
    savedFilterModel: any;
    imageUrl: string;
    // ---------
    activeTheme: 'light' | 'dark' = 'light'; // Varsayılan tema
    gridApi!: GridApi;
    columnApi!: ColumnApi;
    gridOptions: GridOptions = {
        localeText: AG_GRID_LOCALE_TR, // Türkçe dil desteği
    };

    // ----------
    rowData$: Observable<Register[]>; // rowData artık store'dan observable olarak gelecek
    requestTime: any;

    constructor(
        private profileService: ProfileService,
        private translateService: TranslateService,
        private themeModeService: ThemeModeService,
        private attendanceService: AttendanceService,
        private registerStore: Store
    ) {
        this.imageUrl = this.profileService.getImageUrl();
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['filter']) {
            // Filtre değiştiğinde, yeni filtre değerini al ve grid'i güncelle
            this.savedFilterModel = changes['filter'].currentValue;
            console.log('Yeni Filtre Modeli:', this.savedFilterModel);
        }

        const triggeredChange = changes['triggered']; // triggered değişkeni değiştiğinde
        if (triggeredChange && !triggeredChange.firstChange && triggeredChange.previousValue !== triggeredChange.currentValue) { 
            // Eğer triggered değiştiyse, grid'i güncelle
            console.log('Triggered değişti:', triggeredChange.currentValue);
            this.send();
        }

        const editTriggeredChange = changes['editTriggered']; // editTriggered değişkeni değiştiğinde
        if (editTriggeredChange && !editTriggeredChange.firstChange && editTriggeredChange.previousValue !== editTriggeredChange.currentValue) { 
            // Eğer triggered değiştiyse, grid'i güncelle
            console.log('Triggered değişti:', editTriggeredChange.currentValue);
            this.editSend();
        }

        if (changes['groupId']) {
            // Eğer groupId değiştiyse, grid'i güncelle
            console.log('Group ID değişti:', changes['groupId'].currentValue);
            this.clearFilters();
            // this.getRegistryList(); // Yeni grup ID'sine göre veriyi al
        }

        if (changes['selectedDetail']) {
            if (changes['selectedDetail'].currentValue == 'new') {
                this.clearFilters(); // Eğer selectedDetail null ise, filtreleri temizle
                // Seçilecek satır yoksa, tüm satırların seçimini kaldır
                this.gridApi.forEachNode((node: IRowNode) => {
                    node.setSelected(false);
                });
                this.columnApi.setRowGroupColumns([]); // Gruplama kolonlarını temizle
                return; // Eğer selectedDetail null ise, hiçbir şey yapma
            } else if (!changes['selectedDetail'].currentValue) {
                return; // Eğer selectedDetail undefined ise, hiçbir şey yapma
            }

            console.log('Selected Detail değişti:', changes['selectedDetail'].currentValue);

            const selectedDetail = changes['selectedDetail'].currentValue;

            if (this.gridApi) {
                if (selectedDetail && selectedDetail.statik == 1) {
                    this.clearFilters();

                    // this.getRegistryList(); // Seçilen detay değiştiğinde veriyi al
                    // Seçilen detay dinamik ise, gridden checkbox kolonunu göster
                    if (this.columnApi.getColumn('checkbox')) {
                        this.columnApi.setColumnVisible('checkbox', true);
                    }
                    this.columnApi.setRowGroupColumns([]);
                    
                    // Detay varsa ve statik == 1 ise
                    if (selectedDetail.siciller && selectedDetail.siciller.length > 0) {
                        const selectedIds = selectedDetail.siciller.map((item: any) => item.sicilid);
                        const selectedIdsSet = new Set(selectedIds);

                        // 1. Mevcut rowData'yı al, seçili olanları en üste taşı
                        this.rowData$.pipe(take(1)).subscribe((rowData) => {
                            const sortedRowData = [...rowData].sort((a, b) => {
                                const aSelected = selectedIdsSet.has(a.Id) ? 0 : 1;
                                const bSelected = selectedIdsSet.has(b.Id) ? 0 : 1;
                                return aSelected - bSelected;
                            });

                            // 2. Grid'e sıralı veriyi ata
                            this.gridApi.setRowData(sortedRowData);

                            // 3. Seçili olanları tekrar işaretle (rowData set edince seçim silinir)
                            setTimeout(() => {
                                this.gridApi.forEachNode((node: IRowNode) => {
                                    node.setSelected(selectedIdsSet.has(node.data.Id));
                                });
                            });
                        });
                    } else {
                        // Seçilecek satır yoksa, tüm satırların seçimini kaldır
                        this.gridApi.forEachNode((node: IRowNode) => {
                            node.setSelected(false);
                        });
                    }
                }

                else if (selectedDetail && selectedDetail.statik == 0) {
                    // Detay varsa ve statik == 0 ise
                    // Tüm seçimleri kaldır
                    this.gridApi.forEachNode((node: IRowNode) => {
                        node.setSelected(false);
                    });

                    // Gruplama modeli oluştur
                    const savedFilterModel = {
                        cbo_firma: selectedDetail.firmaid || 0,
                        cbo_bolum: selectedDetail.bolumid || 0,
                        cbo_pozisyon: selectedDetail.pozisyonid || 0,
                        cbo_gorev: selectedDetail.gorevid || 0,
                        cbo_altfirma: selectedDetail.altfirmaid || 0,
                        yaka: selectedDetail.yakaid || 0,
                        cbo_direktorluk: selectedDetail.direktorlukid || 0
                    };


                    // Filtre modelini güncelle
                    this.savedFilterModel = savedFilterModel;

                    // setTimeout(() => {
                    //     this.gridApi.setFilterModel(savedFilterModel);
                    //     // console.log('Filtre Modeli Ayarlandı:', this.gridApi.getFilterModel());
                    //     this.gridApi.onFilterChanged(); // şimdi filtreler hazır, doğru şekilde tetiklenir
                    // }, 1000);


                    // Sadece geçerli olan grupları ayarla
                    const groupColumns = [
                        savedFilterModel.cbo_firma !== 0 ? 'cbo_firma' : '',
                        savedFilterModel.cbo_bolum !== 0 ? 'cbo_bolum' : '',
                        savedFilterModel.cbo_pozisyon !== 0 ? 'cbo_pozisyon' : '',
                        savedFilterModel.cbo_gorev !== 0 ? 'cbo_gorev' : '',
                        savedFilterModel.cbo_altfirma !== 0 ? 'cbo_altfirma' : '',
                        savedFilterModel.yaka !== 0 ? 'cbo_yaka' : '',
                        savedFilterModel.cbo_direktorluk !== 0 ? 'cbo_direktorluk' : ''
                    ].filter(col => col !== '');

                    this.columnApi.setRowGroupColumns(groupColumns);
                    
                    this.getRegistryList(savedFilterModel); // Seçilen detay değiştiğinde veriyi al
                    
                    // Seçilen detay dinamik ise, gridden checkbox kolonunu kaldır
                    if (this.columnApi.getColumn('checkbox')) {
                        this.columnApi.setColumnVisible('checkbox', false);
                    }
                }
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
            {
                headerName: this.translateService.instant('Fotoğraf'),
                field: 'imagePath',
                editable: false,
                pinned: 'left',
                minWidth: 60,
                maxWidth: 60,
                filter: false,
                sortable: false,
                headerTooltip: this.translateService.instant('Fotoğraf'),
                cellStyle: {},
                cellRenderer: (params: any) => this.getImageGrid(params),
                cellRendererParams: { exampleParameter: 'red' },
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
                        headerName: this.translateService.instant('SID'),
                        field: 'Id',
                        headerTooltip: this.translateService.instant('Sicil_Id'),
                        type: 'numericColumn',
                        filter: false,
                        // cellClass: (params) => this.applyWeekendClass(params),
                        hide: false,
                    },
                    {
                        headerName: this.translateService.instant('Sicil_No'),
                        field: 'sicilno',
                        headerTooltip: this.translateService.instant('Sicil_No'),
                        filter: 'agTextColumnFilter',
                        filterParams: {
                            textMatcher: ({ filterOption, value, filterText }: {
                                filterOption: string;
                                value: string;
                                filterText: string;
                            }) => {
                                return true;
                            },
                            debounceMs: 3000,
                        },
                        // cellClass: (params) => this.applyWeekendClass(params),
                        hide: false,
                    },
                    {
                        headerName: this.translateService.instant('Ad'),
                        field: 'ad',
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
                        hide: false
                    },
                    {
                        headerName: this.translateService.instant('Soyad'),
                        field: 'soyad',
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
                        // cellClass: (params) => this.applyWeekendClass(params),
                        hide: false,
                    },
                    {
                        headerName: this.translateService.instant('Personel_No'),
                        field: 'personelno',
                        headerTooltip: this.translateService.instant('Personel_No'),
                        type: 'numericColumn',
                        filter: false,
                        // cellClass: (params) => this.applyWeekendClass(params),
                        hide: false,
                    },
                ],
            },

            //Organizasyon Bilgileri
            {
                headerName: this.translateService.instant('Organizasyon_Bilgileri'),
                headerClass: 'organization-group',
                marryChildren: true,
                groupId: 'organizationGroup',
                hide: false,
                children: [
                    {
                        colId: 'cbo_firma',
                        headerName: this.translateService.instant('Firma'),
                        field: 'firmaad',
                        headerTooltip: this.translateService.instant('Firma_Adı'),
                        rowGroup: false,
                        enableRowGroup: true,
                        hide: false,
                        filter: OrganizationColumnFilterComponent,
                    },
                    {
                        colId: 'cbo_altfirma',
                        headerName: this.translateService.instant('Alt_Firma'),
                        field: 'altfirmaad',
                        headerTooltip: this.translateService.instant('Alt_Firma_Adı'),
                        rowGroup: false,
                        enableRowGroup: true,
                        hide: false,
                        filter: OrganizationColumnFilterComponent,
                    },
                    {
                        colId: 'cbo_yaka',
                        headerName: this.translateService.instant('Yaka'),
                        field: 'yakaad',
                        headerTooltip: this.translateService.instant('Yaka_Adı'),
                        rowGroup: false,
                        enableRowGroup: true,
                        hide: false,
                        filter: OrganizationColumnFilterComponent,
                    },
                    {
                        colId: 'cbo_bolum',
                        headerName: this.translateService.instant('Bölüm'),
                        field: 'bolumad',
                        headerTooltip: this.translateService.instant('Bölüm_Adı'),
                        rowGroup: false,
                        enableRowGroup: true,
                        hide: false,
                        filter: OrganizationColumnFilterComponent,
                    },
                    {
                        colId: 'cbo_gorev',
                        headerName: this.translateService.instant('Görev'),
                        field: 'gorevad',
                        headerTooltip: this.translateService.instant('Görev_Adı'),
                        rowGroup: false,
                        enableRowGroup: true,
                        hide: false,
                        filter: OrganizationColumnFilterComponent,
                    },
                    {
                        colId: 'cbo_pozisyon',
                        headerName: this.translateService.instant('Pozisyon'),
                        field: 'pozisyonad',
                        headerTooltip: this.translateService.instant('Pozisyon_Adı'),
                        rowGroup: false,
                        enableRowGroup: true,
                        hide: false,
                        filter: OrganizationColumnFilterComponent,
                    },
                    {
                        colId: 'cbo_direktorluk',
                        headerName: this.translateService.instant('Direktörlük'),
                        field: 'direktorlukad',
                        headerTooltip: this.translateService.instant('Direktörlük_Adı'),
                        rowGroup: false,
                        enableRowGroup: true,
                        hide: false,
                        filter: OrganizationColumnFilterComponent,
                    },
                ],
            },

            // Diğer Bilgileri
            {
                headerName: this.translateService.instant('Diğer_Bilgiler'),
                marryChildren: true,
                headerClass: 'other-group',
                groupId: 'otherGroup',
                hide: true,
                children: [
                    {
                        colId: 'cbo_mesaiperiyodlari',
                        headerName: this.translateService.instant('Mesai_Periyodu'),
                        field: 'mesaiperiyoduad',
                        headerTooltip: this.translateService.instant('Mesai_Periyodu'),
                        rowGroup: false,
                        enableRowGroup: true,
                        hide: true,
                        filter: OrganizationColumnFilterComponent
                    },
                    {
                        colId: 'sys_userdef',
                        headerName: this.translateService.instant('Kimlik_Tanımı'),
                        field: 'userdefad',
                        headerTooltip: this.translateService.instant('Kimlik_Tanımı'),
                        rowGroup: false,
                        enableRowGroup: true,
                        hide: true,
                        filter: OrganizationColumnFilterComponent
                    },
                    {
                        colId: 'Yetki',
                        headerName: this.translateService.instant('Geçiş_Yetkileri'),
                        field: 'yetkistrad',
                        headerTooltip: this.translateService.instant('Geçiş_Yetkileri'),
                        rowGroup: false,
                        enableRowGroup: true,
                        hide: true,
                        filter: OrganizationColumnFilterComponent,
                    },
                    {
                        headerName: this.translateService.instant('Kart_No'),
                        field: 'cardID',
                        headerTooltip: this.translateService.instant('Kart_No'),
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
                        hide: true,
                    },
                    {
                        headerName: this.translateService.instant('Kantin_Kredi'),
                        field: 'credit',
                        headerTooltip: this.translateService.instant('Kantin_Kredi'),
                        filter: false,
                        hide: true,
                        valueFormatter: (params) => this.parseCredit(params),
                    },
                    {
                        headerName: this.translateService.instant('İndirim_Oranı'),
                        field: 'indirimorani',
                        headerTooltip: this.translateService.instant('İndirim_Oranı'),
                        filter: false,
                        hide: true,
                        valueFormatter: (params) => this.parsePercent(params),
                    },
                ],
            },
        ];

        // ----------
        this.getTheme(); // Tema moduna subscribe ol
        // ----------

        this.rowData$ = this.registerStore.select(selectAllRegisters); // Store'dan veriyi çekiyoruz


    }


    // ----------
    getTheme() {
        this.themeModeService.mode.pipe(takeUntil(this.ngUnsubscribe)).subscribe((mode: any) => {
            this.changeTheme(mode);
        });
    }

    changeTheme(theme: 'light' | 'dark') {
        this.activeTheme = theme;
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

    autoSizeAllColumns() {
        if (this.columnApi) {
            const allColumnIds: string[] = ['sicilid', 'sicilno', 'ad', 'soyad', 'mesaitarih', 'ggiris', 'gcikis'];
            this.columnApi.getColumns()?.forEach((column) => {
                allColumnIds.push(column.getId());
            });
            this.columnApi.autoSizeColumns(allColumnIds, false); // False: İçeriğe göre en küçük hale getir
        }
    }

    onFilterChanged(e: FilterChangedEvent) {
        if (this.gridApi) {
            savedFilterModel = this.gridApi.getFilterModel();
            console.log('SavedFilterModel: ', savedFilterModel);

            this.savedFilterModel = savedFilterModel;
            this.getRegistryList();

        }
    }



    onSelectionChanged() {
        // Seçim değiştiğinde çağrılır
        if (this.gridApi) {
            const selectedRows = this.gridApi.getSelectedRows();
            console.log('Seçilenler:', selectedRows);
            this.attendanceService.setSelectedItems(selectedRows);
        }
    }
    // ----------

    getRegistryList(filterFromParent?: any) {
        // Eğer filtre modelini parent'tan alıyorsak, onu kullan
        this.rowData = [];

        var sp: any[] = [
            {
                mkodu: 'yek329',
                id: '0',
                ad: savedFilterModel?.ad?.filter || '',
                soyad: savedFilterModel?.soyad?.filter || '',
                sicilno: savedFilterModel?.sicilno?.filter || '',
                personelno: savedFilterModel?.personelno?.filter || '',
                firma: filterFromParent?.cbo_firma?.toString() || savedFilterModel?.cbo_firma?.toString() || '0',
                bolum: filterFromParent?.cbo_bolum?.toString() || savedFilterModel?.cbo_bolum?.toString() || '0',
                pozisyon: filterFromParent?.cbo_pozisyon?.toString() || savedFilterModel?.cbo_pozisyon?.toString() || '0',
                gorev: filterFromParent?.cbo_gorev?.toString() || savedFilterModel?.cbo_gorev?.toString() || '0',
                altfirma: filterFromParent?.cbo_altfirma?.toString() || savedFilterModel?.cbo_altfirma?.toString() || '0',
                yaka: filterFromParent?.yaka?.toString() || savedFilterModel?.yaka?.toString() || '0',
                direktorluk: filterFromParent?.cbo_direktorluk?.toString() || savedFilterModel?.cbo_direktorluk?.toString() || '0',
                mesaiperiyodu: savedFilterModel?.cbo_mesaiperiyodlari?.toString() || '0',
                sicilgroup: '0',
                userdef: savedFilterModel?.sys_userdef?.toString() || '0',
                yetki: savedFilterModel?.Yetki?.toString() || '-1',
                cardid: savedFilterModel?.cardID?.filter || '',
                aktif: '1',
                okod1: '',
                okod2: '',
                okod3: '',
                okod4: '',
                okod5: '',
                okod6: '',
                okod7: '',
                tumveri: '1',
                grupid: this.groupId?.toString() || '0', // Grup ID'sini kullan,
                formid: this.selectedDetail?.formid?.toString() || '0', // Form ID'sini kullan
            }
        ];



        console.log("Sicil Params: ", sp);

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
            const data = response[0].x;
            const message = response[0].z;

            if (message.islemsonuc == -1) {
                return;
            }
            console.log("Sicil Listesi Geldi: ", data);
            this.requestTime = data[0]?.zaman.replace('T', ' ');
            console.log("TESTOOOO :", this.requestTime);
            // this.requestTimeEvent.emit(this.requestTime);
            this.registerStore.dispatch(loadRegistersSuccess({ registers: data }));



        }, (error: any) => {
            this.registerStore.dispatch(loadRegistersFailure({ error }));
        });
    }

    getImageGrid(params: any, imageSize = '10') {
        if (params?.data?.Id == undefined) {
            return '';
        }

        return (
            `
            <div class="bg-hover-light d-flex justify-content-center mt-1">
              <img style="width: 23px; height: 23px; border-radius: 5px;" src="${this.imageUrl}?sicilid=` +
            params.data.Id +
            `">
            </div>
          `
        );
    }

    onFilterModified(e: FilterModifiedEvent) {
        // console.log("onFilterModified", e);
        // console.log("filterInstance.getModel() =>", e.filterInstance.getModel());
        // console.log(
        //   "filterInstance.getModelFromUi() =>",
        //   (e.filterInstance as unknown as IProvidedFilter).getModelFromUi(),
        // );
    }


    onFilterOpened(e: FilterOpenedEvent) {
        console.log('onFilterOpened', e);
    }

    onSelectionChangedLight() {
        const selectedRows = this.gridApi.getSelectedRows();
        console.log('Seçilenler : ', selectedRows);
        this.attendanceService.setSelectedItems(selectedRows);
    }

    onSelectionChangedDark() {
        const selectedRows = this.gridApi.getSelectedRows();
        console.log('Seçilenler : ', selectedRows);
        this.attendanceService.setSelectedItems(selectedRows);
    }

    getRowHeight(params: RowHeightParams): number | undefined | null {
        return params?.data?.rowHeight;
    }

    getContextMenuItems(params: any) {
        return [
            'copy',
            'copyWithHeaders',
            'paste',
            'separator',
            {
                name: 'Export',
                icon: '<span class="ag-icon ag-icon-save" unselectable="on" role="presentation"></span>',
                subMenu: [
                    {
                        name: 'CSV Export',
                        action: () => {
                            params.context.component.helper.exportData(
                                params.context.component,
                                { exportMode: 'csv' }
                            );
                        },
                    },
                    {
                        name: 'Excel Export (.xlsx)',
                        action: () => {
                            console.log(
                                'params.context this.gridApi',
                                params.context.component.gridApi
                            );
                            params.context.component.helper.exportData(
                                params.context.component,
                                { exportMode: 'xlsx' }
                            );
                        },
                    },
                    {
                        name: 'Excel Export (.xml)',
                        action: () => {
                            params.context.component.helper.exportData(
                                params.context.component,
                                { exportMode: 'xlsx.xml' }
                            );
                        },
                    },
                ],
            },
        ];
    }

    clearFilters() {
        this.gridApi?.setFilterModel(null);
        console.log("Tüm Filtreler Temizlendi!!");
        this.getRegistryList();
    }

    applyLinkClass() {
        return "text-danger fw-bolder text-decoration-underline link-style"
    }

    parseCredit(params: ValueFormatterParams) {
        if (!params.value) {
            return '0 TL';
        } else {
            return `${params.value} TL`;
        }
    }

    parsePercent(params: ValueFormatterParams) {
        if (!params.value) {
            return '%0';
        } else {
            return `%${params.value}`;
        }
    }

    send() {
        const selectedRows = this.gridApi.getSelectedRows();
        if (selectedRows.length > 0) {
            savedFilterModel = {
                ...this.savedFilterModel,
                selectedRows: selectedRows // Seçilen satırları filtre modeline ekle
            };
        }
        this.filterEvent.emit(savedFilterModel); // Filtre modelini emit et
    }

    editSend() {
        const selectedRows = this.gridApi.getSelectedRows();
        if (selectedRows.length > 0) {
            savedFilterModel = {
                ...this.savedFilterModel,
                selectedRows: selectedRows // Seçilen satırları filtre modeline ekle
            };
        }
        this.editEvent.emit(savedFilterModel); // Filtre modelini emit et
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }
}

var savedFilterModel: any = null;
