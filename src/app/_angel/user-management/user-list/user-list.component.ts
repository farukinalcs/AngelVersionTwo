import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { _, ColumnApi, FilterChangedEvent, FilterModifiedEvent, FilterOpenedEvent, GridOptions, GridReadyEvent, RowHeightParams } from 'ag-grid-community';
import { ColDef, ColGroupDef, IMultiFilterParams, IRowNode, IsRowSelectable, SideBarDef, StatusPanelDef, ValueFormatterParams, GridApi } from 'ag-grid-enterprise';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { ThemeModeService } from 'src/app/_metronic/partials/layout/theme-mode-switcher/theme-mode.service';
import { ProfileService } from '../../profile/profile.service';
import { Store } from '@ngrx/store';
import { loadRegistersFailure, loadRegistersSuccess } from 'src/app/store/actions/register.action';
import { Register } from 'src/app/store/models/register.state';
import { selectAllRegisters } from 'src/app/store/selectors/register.selector';
import { resetAccessGroups } from 'src/app/store/actions/access-group.action';
import { AttendanceService } from '../../attendance/attendance.service';
import { OrganizationColumnFilterComponent } from '../../attendance/organization-column-filter/organization-column-filter.component';
import { Router } from '@angular/router';
import { AG_GRID_LOCALE_TR } from '@ag-grid-community/locale';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { ImageTooltipRendererComponent } from '../../shared/registry-list/image-renderer/image-tooltip-renderer.component';
import { DialogModule } from 'primeng/dialog';
import { ApplicationUseComponent } from './application-use/application-use.component';
import { CarouselModule } from 'primeng/carousel';
import { AuthorityComponent } from './authority/authority.component';
import { RegisterAuthorityComponent } from './register-authority/register-authority.component';

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        TooltipModule,
        AgGridModule,
        DialogModule,
        ApplicationUseComponent,
        AuthorityComponent,
        RegisterAuthorityComponent,
        CarouselModule
    ],
    templateUrl: './user-list.component.html',
    styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
    private ngUnsubscribe = new Subject();

    fromWhere: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    gridHeight = '80vh';
    gridStyle: any = {
        height: this.gridHeight,
        flex: '1 1 auto',
    };

    public defaultColDef: ColDef = {
        minWidth: 70,
        filter: false,
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

    public columnDefs: (ColDef | ColGroupDef)[];

    loading: boolean = false;
    savedFilterModel: any;
    displayRegistryCard: boolean = false;
    selectedRegister: any;
    imageUrl: string;
    requestTime: any;
    response: any;
    displayFilterModal: boolean = false;
    filterFromModal: boolean = false;
    filterValueFromModal: { formValues: any };
    displayBulkChangeModal: boolean = false;

    // ---------
    activeTheme: 'light' | 'dark' = 'light'; // Varsayılan tema
    gridApi!: GridApi;
    columnApi!: ColumnApi;
    gridOptions: GridOptions = {
        localeText: AG_GRID_LOCALE_TR, // Türkçe dil desteği
    };
    // ----------
    rowData$: Observable<Register[]>; // rowData artık store'dan observable olarak gelecek

    tabs: any[] = [
        { id: 1, label: this.translateService.instant('Program_Kullanımı') },
        { id: 2, label: this.translateService.instant('Menü Yetkileri') },
        { id: 3, label: this.translateService.instant('Sicil Yetkileri') }
    ];
    selectedIndex: any = 1;
    loginDetail: any;


    constructor(
        private profileService: ProfileService,
        private translateService: TranslateService,
        private themeModeService: ThemeModeService,
        private attendanceService: AttendanceService,
        private ref: ChangeDetectorRef,
        private registerStore: Store,
        private router: Router
    ) {
        this.imageUrl = this.profileService.getImageUrl();

        this.gridOptions = {
            localeText: AG_GRID_LOCALE_TR, // Türkçe dil desteği
            context: {
                imageBaseUrl: this.imageUrl
            }
        };
    }

    ngAfterViewInit(): void {
        this.setGridSetting();
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
                // cellRenderer: (params: any) => this.getImageGrid(params),
                cellRenderer: ImageTooltipRendererComponent,
                // cellRendererParams: { exampleParameter: 'red' },
                hide: false,
            },
            // {
            //     colId: 'icon',
            //     headerName: this.translateService.instant('Simge'),
            //     pinned: 'left',
            //     // minWidth: 108,
            //     // maxWidth: 108,
            //     field: '',
            //     headerTooltip: this.translateService.instant('Simge'),
            //     filter: false,
            //     hide: false,
            //     cellRenderer: (params: any) => this.iconClass(params),
            // },

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
                        hide: false,
                        // onCellDoubleClicked: (params) => this.clickedRegistry(params)
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
                        menuTabs: []
                    },
                ],
            },

            //Organizasyon Bilgileri
            {
                headerName: this.translateService.instant('Organizasyon_Bilgileri'),
                headerClass: 'organization-group',
                marryChildren: true,
                groupId: 'organizationGroup',
                hide: true,
                children: [
                    {
                        colId: 'cbo_firma',
                        headerName: this.translateService.instant('Firma'),
                        field: 'firmaad',
                        headerTooltip: this.translateService.instant('Firma_Adı'),
                        rowGroup: false,
                        enableRowGroup: true,
                        hide: true,
                        filter: OrganizationColumnFilterComponent,
                    },
                    {
                        colId: 'cbo_altfirma',
                        headerName: this.translateService.instant('Alt_Firma'),
                        field: 'altfirmaad',
                        headerTooltip: this.translateService.instant('Alt_Firma_Adı'),
                        rowGroup: false,
                        enableRowGroup: true,
                        hide: true,
                        filter: OrganizationColumnFilterComponent,
                    },
                    {
                        colId: 'cbo_yaka',
                        headerName: this.translateService.instant('Yaka'),
                        field: 'yakaad',
                        headerTooltip: this.translateService.instant('Yaka_Adı'),
                        rowGroup: false,
                        enableRowGroup: true,
                        hide: true,
                        filter: OrganizationColumnFilterComponent,
                    },
                    {
                        colId: 'cbo_bolum',
                        headerName: this.translateService.instant('Bölüm'),
                        field: 'bolumad',
                        headerTooltip: this.translateService.instant('Bölüm_Adı'),
                        rowGroup: false,
                        enableRowGroup: true,
                        hide: true,
                        filter: OrganizationColumnFilterComponent,
                    },
                    {
                        colId: 'cbo_gorev',
                        headerName: this.translateService.instant('Görev'),
                        field: 'gorevad',
                        headerTooltip: this.translateService.instant('Görev_Adı'),
                        rowGroup: false,
                        enableRowGroup: true,
                        hide: true,
                        filter: OrganizationColumnFilterComponent,
                    },
                    {
                        colId: 'cbo_pozisyon',
                        headerName: this.translateService.instant('Pozisyon'),
                        field: 'pozisyonad',
                        headerTooltip: this.translateService.instant('Pozisyon_Adı'),
                        rowGroup: false,
                        enableRowGroup: true,
                        hide: true,
                        filter: OrganizationColumnFilterComponent,
                    },
                    {
                        colId: 'cbo_direktorluk',
                        headerName: this.translateService.instant('Direktörlük'),
                        field: 'direktorlukad',
                        headerTooltip: this.translateService.instant('Direktörlük_Adı'),
                        rowGroup: false,
                        enableRowGroup: true,
                        hide: true,
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
                hide: false,
                children: [
                    {
                        colId: 'cbo_mesaiperiyodlari',
                        headerName: this.translateService.instant('Mesai_Periyodu'),
                        field: 'mesaiperiyoduad',
                        headerTooltip: this.translateService.instant('Mesai_Periyodu'),
                        rowGroup: false,
                        enableRowGroup: true,
                        hide: false,
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
                        filter: OrganizationColumnFilterComponent,
                        filterParams: {
                            customVariable: this.fromWhere,
                        },
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
                        hide: false,
                    },
                    // {
                    //     headerName: this.translateService.instant('Kantin_Kredi'),
                    //     field: 'credit',
                    //     headerTooltip: this.translateService.instant('Kantin_Kredi'),
                    //     filter: false,
                    //     hide: false,
                    //     valueFormatter: (params) => this.parseCredit(params),
                    // },
                    // {
                    //     headerName: this.translateService.instant('İndirim_Oranı'),
                    //     field: 'indirimorani',
                    //     headerTooltip: this.translateService.instant('İndirim_Oranı'),
                    //     filter: false,
                    //     hide: false,
                    //     valueFormatter: (params) => this.parsePercent(params),
                    // },
                ],
            },
        ];

        // ----------
        this.getTheme(); // Tema moduna subscribe ol
        // ----------
        this.rowData$ = this.registerStore.select(selectAllRegisters); // Store'dan veriyi çekiyoruz
        this.getRegistryList();
    }
    ngOnChanges(changes: SimpleChanges): void {
        // if (changes['selectedTab']) {
        //     console.log('Selected Tab değişti:', changes['selectedTab'].currentValue);
        //     this.rowData$ = this.registerStore.select(selectAllRegisters); // Store'dan veriyi çekiyoruz
        //     this.getRegistryList();
        // } else if (changes['clear']) {
        //     this.clearFilters();
        // } else if (changes['refreshEvent']) {
        //     this.getRegistryList();
        // } else if (changes['filterEvent']) {
        //     this.openFilterModal();
        // } else if (changes['bulkChangeEvent']) {
        //     this.openBulkChangeModal();
        // }
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
            const allColumnIds: string[] = ['sicilid', 'sicilno', 'ad', 'soyad', 'mesaitarih', 'ggiris', 'gcikis', 'icon'];
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

    getRegistryList() {
        this.rowData = [];

        var sp: any[] = !this.filterFromModal
            ?
            [{
                mkodu: 'yek081',
                id: '0',
                ad: savedFilterModel?.ad?.filter || '',
                soyad: savedFilterModel?.soyad?.filter || '',
                sicilno: savedFilterModel?.sicilno?.filter || '',
                personelno: savedFilterModel?.personelno?.filter || '',
                firma: savedFilterModel?.cbo_firma?.toString() || '0',
                bolum: savedFilterModel?.cbo_bolum?.toString() || '0',
                pozisyon: savedFilterModel?.cbo_pozisyon?.toString() || '0',
                gorev: savedFilterModel?.cbo_gorev?.toString() || '0',
                altfirma: savedFilterModel?.cbo_altfirma?.toString() || '0',
                yaka: savedFilterModel?.yaka?.toString() || '0',
                direktorluk: savedFilterModel?.cbo_direktorluk?.toString() || '0',
                mesaiperiyodu: savedFilterModel?.cbo_mesaiperiyodlari?.toString() || '0',
                sicilgroup: '0',
                userdef: savedFilterModel?.sys_userdef?.toString() || '1',
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
                tumveri: '1'
            }]
            :
            [{
                mkodu: 'yek081',
                id: '0',
                ad: this.filterValueFromModal.formValues.name,
                soyad: this.filterValueFromModal.formValues.surname,
                sicilno: this.filterValueFromModal.formValues.registrationNumber,
                personelno: savedFilterModel?.personelno?.filter || '',
                firma: this.filterValueFromModal.formValues.company,
                bolum: this.filterValueFromModal.formValues.department,
                pozisyon: this.filterValueFromModal.formValues.position,
                gorev: this.filterValueFromModal.formValues.job,
                altfirma: this.filterValueFromModal.formValues.subcompany,
                yaka: this.filterValueFromModal.formValues.collar,
                direktorluk: this.filterValueFromModal.formValues.directorship,
                mesaiperiyodu: savedFilterModel?.cbo_mesaiperiyodlari?.toString() || '0',
                sicilgroup: '0',
                userdef: savedFilterModel?.sys_userdef?.toString() || '1',
                yetki: savedFilterModel?.Yetki?.toString() || '-1',
                cardid: savedFilterModel?.cardID?.filter || '',
                aktif: '1',
                okod1: this.filterValueFromModal.formValues.code1,
                okod2: this.filterValueFromModal.formValues.code2,
                okod3: this.filterValueFromModal.formValues.code3,
                okod4: this.filterValueFromModal.formValues.code4,
                okod5: this.filterValueFromModal.formValues.code5,
                okod6: this.filterValueFromModal.formValues.code6,
                okod7: this.filterValueFromModal.formValues.code7,
                tumveri: '1'
            }]


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

    onColumnVisible(event: any) {
        this.sendColumnStateToApi();
    }

    setGridSetting() {
        var sp: any[] = [
            {
                mkodu: 'yek105',
                ad: 'sicil_yetki_1_gridSettings',
            },
        ];

        this.profileService
            .requestMethod(sp)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                map((response) => this.parseValue(response[0].x[0]?.deger))
            )
            .subscribe((response: any) => {
                console.log('Grid Settings: ', response);
                this.setColumnWidths(response);
            });
    }

    private parseValue(value: string): { col: string; width: string; visible: string }[] {
        return value?.split('|').map((item) => {
            const parts = item.split('#');
            return {
                col: parts[0],
                width: parts[1],
                visible: parts[2],
            };
        });
    }

    setColumnWidths(widths: { col: string; width: string; visible: string }[]) {
        const updateColumnWidths = (colDef: any) => {
            const widthInfo = widths?.find((w) => w.col === colDef.field);
            if (widthInfo) {
                colDef.width = parseInt(widthInfo.width, 10);
                // colDef.hide = widthInfo.visible !== 'true';
                colDef.hide = !JSON.parse(widthInfo.visible);

                if (colDef.flex) {
                    delete colDef.flex;
                }
            }
            if (colDef.children && colDef.children.length > 0) {
                colDef.children.forEach(updateColumnWidths);
            }
        };

        this.columnDefs.forEach(updateColumnWidths);
        // this.gridApi.setColumnDefs(this.columnDefs);

        if (this.gridApi) {
            this.gridApi.setColumnDefs(this.columnDefs);
            this.gridApi.sizeColumnsToFit();
            console.log('ColumnDef: ', this.columnDefs);
        } else {
            console.error('Sanırım bir problem var!');
        }
    }

    sendColumnStateToApi() {
        const allColumns = this.columnApi.getColumns();
        if (!allColumns) {
            console.error('No columns found.');
            return;
        }

        const columnStateString = allColumns
            .map((col) => {
                const colDef = col.getColDef();
                const width = col.getActualWidth();
                const visible = col.isVisible();
                return `${colDef.field || colDef.colId}#${width}#${visible}`;
            })
            .join('|');

        console.log(columnStateString);

        var sp: any[] = [
            {
                mkodu: 'yek104',
                ad: 'sicil_yetki_1_gridSettings',
                deger: columnStateString,
            },
        ];
        console.log("Grid Setting Param: ", sp);

        this.profileService
            .requestMethod(sp)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((response: any) => {
                console.log('Grid Settings Are Send: ', response);
            });
    }

    onColumnResized(event: any) {
        if (event.finished && event.column) {
            console.log(
                'Column resized:',
                event.column.getId(),
                'New width:',
                event.column.getActualWidth(),
                '   asdasd: ',
                this.columnApi.getAllGridColumns()
            );
            this.sendColumnStateToApi();
        }
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

    iconClass(params: any) {
        if (params?.column?.colId === 'icon') {
            const icons: string[] = [];

            // Geçici Kart
            if (params?.data?.cardID === 'Geçici Kart') {
                icons.push(`
                <i class="fa-solid fa-id-card-clip text-dark fs-4 mx-1" title="${this.translateService.instant('Geçici_Kart')}"></i>
                `);
            }

            // Online
            if ((params?.data?.isonline || '').toLowerCase() == 'online') {
                icons.push(`
                <i class="fa-solid fa-globe text-success fs-4 mx-1" title="${this.translateService.instant('Çevrimiçi')}"></i>
                `);
            }

            // Offline
            if ((params?.data?.isonline || '').toLowerCase() == 'offline') {
                icons.push(`
                <i class="fa-solid fa-globe text-danger fs-4 mx-1" title="${this.translateService.instant('Çevrimdışı')}">
                `);
            }

            // İzleme Yetkisi
            //   if (params?.data?.lYetki.toString() === '59') {
            //     icons.push(`
            //       <i class="fa-solid fa-eye text-dark fs-4 mx-1" title="${this.translateService.instant('İzleme Yetkisi')}"></i>
            //     `);
            //   }

            //   // Online
            //   if (params?.data?.lYetki.toString() === '59') {
            //     icons.push(`
            //       <i class="fa-solid fa-circle-play text-dark fs-4 mx-1" title="${this.translateService.instant('Online')}"></i>
            //     `);
            //   }

            //   // Offline
            //   if (params?.data?.lYetki.toString() === '59') {
            //     icons.push(`
            //       <i class="fa-solid fa-circle-pause text-dark fs-4 mx-1" title="${this.translateService.instant('Offline')}"></i>
            //     `);
            //   }

            //   // Mobile
            //   if (params?.data?.lYetki.toString() === '59') {
            //     icons.push(`
            //       <i class="fa-solid fa-mobile text-dark fs-4 mx-1" title="${this.translateService.instant('Mobile')}"></i>
            //     `);
            //   }

            // İkonları birleştir ve döndür
            return `
        <div class="d-flex justify-content-center align-items-center h-100">
          ${icons.join('')}
        </div>
      `;
        }
    }

    clearFilters() {
        this.gridApi.setFilterModel(null);
        console.log("Tüm Filtreler Temizlendi!!");
        this.filterFromModal = false;
        this.filterValueFromModal = { formValues: "" };
        this.getRegistryList();
    }

    clickedRegistry(params: any) {
        console.log("Sicile Tıklandı :", params);
        this.selectedRegister = params.data;
        this.displayRegistryCard = true;

        this.ref.detectChanges();
    }

    closeRegistryCard() {
        this.displayRegistryCard = false;
        this.selectedIndex = 0;
        this.resetAccessGroupState();
    }

    applyLinkClass() {
        return "text-danger fw-bolder text-decoration-underline link-style"
    }

    openFilterModal() {
        this.displayFilterModal = true;
    }

    onHideFilterModal() {
        this.displayFilterModal = false;
    }

    setFilterFormFromModal(value: { formValues: any }) {
        console.log('Filtre Geldii. :', value);
        this.filterValueFromModal = value;
        this.filterFromModal = true;
        this.onHideFilterModal();
        this.getRegistryList();

    }

    // openBulkChangeModal() {
    //     this.displayBulkChangeModal = true;
    // }

    // onHideBulkChangeModal(event: any) {
    //     this.displayBulkChangeModal = event;
    //     this.resetAccessGroupState();
    // }

    resetAccessGroupState() {
        this.registerStore.dispatch(resetAccessGroups());
    }

    // completedBulkChange() {
    //     this.getRegistryList();
    // }

    onRowClicked(event: any) {
        this.clickedRegistry(event);
    }

    refreshList() {
        this.getRegistryList();
    }

    changeTabMenu(event: any) {
        this.selectedIndex = event;
    }

    getLoginInfo(event: any) {
        this.loginDetail = event;
        console.log("Login Bilgisi Geldi (event): ", event);
        
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }
}


var savedFilterModel: any = null;