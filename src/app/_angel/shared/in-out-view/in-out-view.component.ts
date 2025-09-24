import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';

import { ProfileService } from '../../profile/profile.service';
import { ConfirmationService } from 'src/app/core/permission/services/core/services/confirmation.service';

type PdksItem = {
  Id: number;
  ad: string;
  soyad: string;
  adsoyad: string;
  terminal: string;
  terminalid: number;
  userid: string;
  zaman: string;             // ISO
  pdks: 1 | 2;               // 1=Giriş, 2=Çıkış
  undelete: boolean | number | string;
  deleted: boolean | number | string;
  mudahale: boolean;
  automatic: boolean;
  anagiriscikis: number;     // 1 ise “ana giriş” veya “ana çıkış”
  yondegistir?: number | boolean | string;

  pendingUniqueId?: string;
  isNew?: boolean;
};

type PendingOp = {
  mkodu?: string;
  id: null;
  uniqueid: string;
  poolid: number | '' | null;
  sicilid: null;
  tip: 1 | 2 | 3;
  tarih: string | null;     
  terminal: string | null;
  aciklama: string | null;
};

const noWhitespaceValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const value = (control.value ?? '') as string;
  return value.trim().length === 0 ? { whitespace: true } : null;
};

@Component({
  selector: 'app-in-out-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TranslateModule,
    DialogModule,
    ReactiveFormsModule,
    DropdownModule,
    CalendarModule,
    InputTextModule,
    FloatLabelModule,
    IconFieldModule,
    InputIconModule,
    ButtonModule,
    DatePipe,
    FormsModule,
    InputSwitchModule,
  ],
  templateUrl: './in-out-view.component.html',
  styleUrls: ['./in-out-view.component.scss'],
})
export class InOutViewComponent implements OnInit, OnDestroy {
  private profileService = inject(ProfileService);
  private ref = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);
  private confirmationService = inject(ConfirmationService);
  private translateService = inject(TranslateService);
  private toastrService = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);

  private _loading = signal<boolean>(true);
  get loading(): boolean {
    return this._loading();
  }
  set loading(v: boolean) {
    this._loading.set(!!v);
  }

  readonly showDeleted = signal<boolean>(true);

  private _invalidIncoming = signal<boolean>(false);
  invalidIncoming(): boolean {
    return this._invalidIncoming();
  }


  @Input() displayInOutView!: boolean;
  @Input() inOutViewData: any;
  @Output() InOutViewHideEvent: EventEmitter<void> = new EventEmitter<void>();


  private _dataList = signal<PdksItem[]>([]);
  private _newItems = signal<PdksItem[]>([]);
  get DataList(): PdksItem[] {
    return this._dataList();
  }
  set DataList(v: PdksItem[]) {
    this._dataList.set(v ?? []);
  }

  readonly items = computed<PdksItem[]>(() =>
    [...this._dataList(), ...this._newItems()].sort(
      (a, b) => new Date(a.zaman).getTime() - new Date(b.zaman).getTime()
    )
  );

  readonly filteredItems = computed<PdksItem[]>(() => {
    const list = this.items?.() ?? [];
    if (this.showDeleted()) return list;
    return list.filter((it) => !this.isDeletedRec(it));
  });

  private _pendingOps = signal<PendingOp[]>([]);
  get pendingOps(): PendingOp[] {
    return this._pendingOps();
  }
  private setPendingOps(v: PendingOp[]) {
    this._pendingOps.set(v ?? []);
  }

  isDown = false;
  startX = 0;
  scrollLeft = 0;

  readonly editTimeForId = signal<number | null>(null);
  editTimeModel: Date | null = null;

  readonly showAddPanel = signal<boolean>(false);
  addPanelForm!: FormGroup;

  deviceGroups: Array<{ id: number; ad: string; io: number }> = [];
  deviceGroupsIn: Array<{ id: number; ad: string; io: number }> = [];
  deviceGroupsOut: Array<{ id: number; ad: string; io: number }> = [];
  readonly MANUAL_IN = 55;
  readonly MANUAL_OUT = 56;

  tr = {
    firstDayOfWeek: 1,
    dayNamesMin: ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'],
    monthNames: [
      'Ocak','Şubat','Mart','Nisan','Mayıs','Haziran',
      'Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık',
    ],
  };

  ngOnInit(): void {
    this.getPdksAcc();
    this.buildAddPanelForm();
    this.getDeviceGroups();
  }
  ngOnDestroy(): void {
    // takeUntilDestroyed kullanılıyor
  }
  coerceTrue(v: any): boolean {
    return v === true || v === 1 || v === '1' || v === 'true';
  }
  coerceFalse(v: any): boolean {
    return v === false || v === 0 || v === '0' || v === 'false';
  }
  isDeletedRec = (r: PdksItem): boolean => !this.coerceTrue(r?.undelete);
  canDeleteRec = (r: PdksItem): boolean => !this.coerceFalse(r?.undelete);

  private matchPendingWithItem(it: PdksItem, op: PendingOp): boolean {
    if (op.poolid === it.Id) return true;
    if (it.pendingUniqueId && op.uniqueid === it.pendingUniqueId) return true;
    return false;
  }
  hasPendingFor(it: PdksItem, tip: 1 | 2 | 3): boolean {
    return this._pendingOps().some(
      (op) => this.matchPendingWithItem(it, op) && op.tip === tip
    );
  }
  getPendingFor(it: PdksItem, tip: 1 | 2 | 3): PendingOp | undefined {
    return this._pendingOps().find(
      (op) => this.matchPendingWithItem(it, op) && op.tip === tip
    );
  }
  private addOrReplacePending(op: PendingOp): void {
    const arr = [...this._pendingOps()];
    const idx = arr.findIndex(
      (x) =>
        x.tip === op.tip &&
        ((op.poolid != null && op.poolid !== '' && x.poolid === op.poolid) ||
          ((op.poolid == null || op.poolid === '') && x.uniqueid === op.uniqueid))
    );
    if (idx >= 0) arr[idx] = op;
    else arr.push(op);
    this.setPendingOps(arr);
  }
  private removePendingBy(it: PdksItem, tip: 1 | 2 | 3): void {
    const arr = this._pendingOps().filter(
      (op) => !(this.matchPendingWithItem(it, op) && op.tip === tip)
    );
    this.setPendingOps(arr);
  }

  disableDelete(it: PdksItem): boolean {
    if (it.isNew) return false;
    return this.isDeletedRec(it) || !this.canDeleteRec(it);
  }
  disableChange(it: PdksItem): boolean {
    if (it.isNew) return true;
    return this.hasPendingFor(it, 2) || this.hasPendingFor(it, 1);
  }
  disableTimeEdit(it: PdksItem): boolean {
    if (it.isNew) return true;
    return !this.canDeleteRec(it) || this.isDeletedRec(it);
  }
  canShowChangeButton(it: PdksItem): boolean {
    if (it.isNew) return false;
    const v: any = it?.yondegistir;
    return !(v === 0 || v === '0' || v === false || v === 'false');
  }

  private genUniqueId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return (crypto as any).randomUUID();
    }
    return `uid_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }

  // ---------- data fetch ----------
  getPdksAcc(): void {
    this.loading = true;
    const sp: any[] = [
      { mkodu: 'yek413',
        sicilid: String(this.inOutViewData?.sicilid ?? ''),
        tarih:   String(this.inOutViewData?.mesaitarih ?? '') },
    ];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          const data = (response?.[0]?.x ?? []) as PdksItem[];
          const message = response?.[0]?.z;

          if (message?.islemsonuc == -1) {
            this.loading = false;
            return;
          }

          this.DataList = data;

          this._invalidIncoming.set(this.computeInvalidIncoming(this.DataList));

          this.loading = false;
          queueMicrotask(() => {
            const el = this.containerEl();
            if (el) el.scrollLeft = 0;
          });
        },
        error: () => {
          this.loading = false;
          this.toastrService.error(
            this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
            this.translateService.instant('Hata')
          );
        },
      });
  }

  getDeviceGroups(): void {
    const sp = [{ mkodu: 'yek041', id: '0', kaynak: 'cbo_terminaller' }];
    this.profileService
      .requestMethod(sp)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          const data = response?.[0]?.x ?? [];
          const message = response?.[0]?.z;
          if (message?.islemsonuc === -1) return;

          const normalized = (data as any[]).map((r: any) => ({
            id: Number(r?.ID ?? r?.id),
            ad: String(r?.ad ?? r?.AD ?? ''),
            io: Number(r?.io ?? r?.IO ?? 0),
          }));
          const withoutManuals = normalized.filter((x) => {
            const id = Number(x?.id);
            return id !== this.MANUAL_IN && id !== this.MANUAL_OUT;
          });

          this.deviceGroupsIn = withoutManuals.filter((x) => x.io === 1 || x.io === 2);
          this.deviceGroupsOut = withoutManuals.filter((x) => x.io === 1 || x.io === 3);
          this.deviceGroups = [...withoutManuals];
          this.ref.markForCheck?.();
        },
        error: () => {},
      });
  }
  terminalNameById(id: number | null | undefined): string {
    if (id == null) return '';
    return this.deviceGroups.find((x) => x.id === id)?.ad ?? String(id);
  }

  viewPdks(it: PdksItem): 1 | 2 {
    if (this.hasPendingFor(it, 3)) return it.pdks === 1 ? 2 : 1;
    return it.pdks;
  }
  viewTime(it: PdksItem): string {
    const p = this.getPendingFor(it, 1);
    if (p?.tarih) {
      const parts = p.tarih.split(' ');
      return parts.length > 1 ? parts[1] : p.tarih;
    }
    return formatDate(it.zaman, 'HH:mm', 'tr-TR');
  }
  isPreviewDeleted(it: PdksItem): boolean {
    return this.hasPendingFor(it, 2);
  }
  isPreviewChanged(it: PdksItem): boolean {
    return this.hasPendingFor(it, 3) || this.hasPendingFor(it, 1);
  }

  hideInOutView(): void {
    this.InOutViewHideEvent.emit();
  }
  @HostListener('wheel', ['$event'])
  onWheel(e: WheelEvent) {
    const el = this.containerEl();
    if (!el) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      el.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  }
  onPointerDown(e: PointerEvent) {
    const el = this.containerEl();
    if (!el) return;
    this.isDown = true;
    el.classList.add('grabbing');
    this.startX = e.clientX;
    this.scrollLeft = el.scrollLeft;
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }
  onPointerMove(e: PointerEvent) {
    if (!this.isDown) return;
    const el = this.containerEl();
    if (!el) return;
    const walk = this.startX - e.clientX;
    el.scrollLeft = this.scrollLeft + walk;
  }
  onPointerUpOrLeave(e?: PointerEvent) {
    const el = this.containerEl();
    this.isDown = false;
    el?.classList.remove('grabbing');
    if (e) (e.target as Element).releasePointerCapture?.(e.pointerId);
  }
  private containerEl(): HTMLElement | null {
    return document.getElementById('pdks-strip-container');
  }

  async onRefresh(item: PdksItem): Promise<void> {
    const title = this.translateService.instant('Onay');
    const msg = this.translateService.instant('Değiştirmek_İstediğinize_Emin_Misiniz');
    const res = await this.confirmationService.confirmAction(msg, title);
    if (!res.isConfirmed) return;

    const op: PendingOp = {
      id: null, uniqueid: this.genUniqueId(), poolid: item.Id,
      sicilid: null, tip: 3, tarih: null, terminal: null, aciklama: null,
    };
    this.addOrReplacePending(op);
    this.toastrService.success(this.translateService.instant('İşlem kuyruğa eklendi'));
  }

  async onDelete(item: PdksItem): Promise<void> {
    if (item.isNew && item.pendingUniqueId) {
      const arr = this._pendingOps().filter(
        (op) => !(op.tip === 1 && op.uniqueid === item.pendingUniqueId)
      );
      this._pendingOps.set(arr);
      this._newItems.set(
        this._newItems().filter((x) => x.pendingUniqueId !== item.pendingUniqueId)
      );
      this.toastrService.info(this.translateService.instant('Taslak kaldırıldı'));
      return;
    }

    const displayName =
      item?.adsoyad || item?.ad || item?.Id?.toString() || this.translateService.instant('Kayıt');

    const res = await this.confirmationService.confirmDelete(
      displayName, this.translateService.instant('Silme_Onayı')
    );
    if (!res.isConfirmed) return;

    const op: PendingOp = {
      id: null, uniqueid: this.genUniqueId(), poolid: item.Id,
      sicilid: null, tip: 2, tarih: null, terminal: null, aciklama: null,
    };
    this.addOrReplacePending(op);
    this.toastrService.success(this.translateService.instant('İşlem kuyruğa eklendi'));
  }

  openTimeEdit(it: PdksItem): void {
    const p1 = this.getPendingFor(it, 1);
    let hhmm = '';
    if (p1?.tarih) {
      const parts = p1.tarih.split(' ');
      hhmm = parts.length > 1 ? parts[1] : '';
    } else {
      hhmm = formatDate(it.zaman, 'HH:mm', 'en-US');
    }
    const d = new Date();
    const [h, m] = (hhmm || '00:00').split(':').map((x) => parseInt(x, 10));
    d.setHours(isFinite(h) ? h : 0, isFinite(m) ? m : 0, 0, 0);

    this.editTimeModel = d;
    this.editTimeForId.set(it.Id);
  }
  cancelTimeEdit(): void {
    this.editTimeForId.set(null);
    this.editTimeModel = null;
  }

  applyTimeEdit(it: PdksItem): void {
    if (!this.editTimeModel) {
      this.toastrService.warning(this.translateService.instant('Lütfen saat seçiniz'));
      return;
    }

    const dateStr = formatDate(this.inOutViewData?.mesaitarih, 'dd-MM-yyyy', 'en-US');
    const timeStr = formatDate(this.editTimeModel, 'HH:mm', 'en-US');
    const tarihCombined = `${dateStr} ${timeStr}`;
    const ms = this.parseDdMMyyyyHHmmToMs(tarihCombined);

    if (this.hasAnyAtSameMinute(tarihCombined, it.Id)) {
      this.toastrService.warning(this.translateService.instant('Ayni_dakikada_kayit_olamaz'));
      return;
    }

    const vMain = this.validateAgainstMainAndPrev(ms, it.pdks, it.Id);
    if (!vMain.ok) {
      this.toastrService.warning(vMain.msg);
      return;
    }

    if (!this.hasPendingFor(it, 2)) {
      const delOp: PendingOp = {
        id: null, uniqueid: this.genUniqueId(), poolid: it.Id,
        sicilid: null, tip: 2, tarih: null, terminal: null, aciklama: null,
      };
      this.addOrReplacePending(delOp);
    }
    const addOp: PendingOp = {
      id: null, uniqueid: this.genUniqueId(), poolid: it.Id,
      sicilid: null, tip: 1, tarih: tarihCombined, terminal: String(it.terminalid ?? ''), aciklama: null,
    };
    this.addOrReplacePending(addOp);

    this.cancelTimeEdit();
    this.toastrService.success(this.translateService.instant('İşlem kuyruğa eklendi'));
  }

  // ---------- form ----------
  private buildAddPanelForm(): void {
    const d = new Date(this.inOutViewData?.mesaitarih ?? new Date());
    d.setHours(0, 0, 0, 0);

    this.addPanelForm = this.fb.group(
      {
        mode: ['single', Validators.required],

        terminalSingle: [null, Validators.required],
        pdks: [1, Validators.required],
        tarihSingle: [d, Validators.required],
        timeSingle: [null, Validators.required],

        terminalIn: [null],
        tarihIn: [d],
        timeIn: [null],

        terminalOut: [null],
        tarihOut: [d],
        timeOut: [null],

        aciklama: ['', [Validators.required, noWhitespaceValidator, Validators.maxLength(200)]],
      },
      { validators: this.pairTimeValidator() }
    );

    this.addPanelForm.get('mode')!.valueChanges.subscribe((mode) => {
      const single = mode === 'single';
      const setReq = (name: string, required: boolean) => {
        const c = this.addPanelForm.get(name)!;
        c.setValidators(required ? [Validators.required] : []);
        c.updateValueAndValidity({ emitEvent: false });
      };

      setReq('terminalSingle', single);
      setReq('pdks', single);
      setReq('tarihSingle', single);
      setReq('timeSingle', single);

      setReq('terminalIn', !single);
      setReq('tarihIn', !single);
      setReq('timeIn', !single);

      setReq('terminalOut', !single);
      setReq('tarihOut', !single);
      setReq('timeOut', !single);
    });
  }

  pairTimeValidator() {
    return (group: AbstractControl): ValidationErrors | null => {
      const mode = group.get('mode')?.value;
      if (mode !== 'pair') return null;

      const tin: Date | null = group.get('timeIn')?.value ?? null;
      const tout: Date | null = group.get('timeOut')?.value ?? null;
      if (!tin || !tout) return { timeRequired: true };

      const inMin = tin.getHours() * 60 + tin.getMinutes();
      const outMin = tout.getHours() * 60 + tout.getMinutes();
      return outMin > inMin ? null : { order: true };
    };
  }

  toggleAddPanel(): void {
    this.showAddPanel.set(!this.showAddPanel());
  }
  cancelAddPanel(): void {
    this.showAddPanel.set(false);
  }

  private combineDateAndTime(date: Date, time: Date): string {
    const dt = new Date(date);
    dt.setHours(time.getHours(), time.getMinutes(), 0, 0);
    return formatDate(dt, 'dd-MM-yyyy HH:mm', 'en-US');
  }
  private parseDdMMyyyyHHmmToMs(dt: string): number {
    const [d, t] = dt.split(' ');
    const [dd, MM, yyyy] = (d || '').split('-').map((n) => parseInt(n, 10));
    const [HH, mm] = (t || '').split(':').map((n) => parseInt(n, 10));
    const js = new Date(yyyy, (MM || 1) - 1, dd || 1, HH || 0, mm || 0, 0, 0);
    return js.getTime();
  }
  private minuteKeyFromIso(iso: string): string {
    try {
      return formatDate(iso, 'dd-MM-yyyy HH:mm', 'en-US');
    } catch {
      const d = new Date(iso);
      return formatDate(d, 'dd-MM-yyyy HH:mm', 'en-US');
    }
  }

  // ---------- ana giriş/çıkış sınırları ----------
  private getMainBounds(): { inMs: number | null; outMs: number | null } {
    const list = this._dataList() ?? [];
    let inMs: number | null = null;
    let outMs: number | null = null;

    for (const r of list) {
      if (Number(r?.anagiriscikis) !== 1 || !r?.zaman) continue;
      const ms = new Date(r.zaman).getTime();
      if (!isFinite(ms)) continue;

      if (Number(r.pdks) === 1) {
        inMs = inMs == null ? ms : Math.min(inMs, ms);   // en erken ana giriş
      } else if (Number(r.pdks) === 2) {
        outMs = outMs == null ? ms : Math.max(outMs, ms); // en geç ana çıkış
      }
    }
    return { inMs, outMs };
  }

  // ---------- timeline & aynı dakika ----------
  private hasAnyAtSameMinute(tarihCombined: string, excludeId?: number): boolean {
    const key = tarihCombined;
    for (const it of this.items()) {
      if (excludeId != null && it.Id === excludeId) continue;
      const k2 = this.minuteKeyFromIso(it.zaman);
      if (k2 === key) return true;
    }
    return false;
  }

  private getTimeline(excludeId?: number): Array<{ ms: number; pdks: 1 | 2; id: number }> {
    const arr = (this.items() ?? [])
      .filter(it => !this.isDeletedRec(it) && !this.isPreviewDeleted(it) && !!it.zaman)
      .filter(it => excludeId == null ? true : it.Id !== excludeId)
      .map(it => ({
        ms: new Date(it.zaman).getTime(),
        pdks: this.viewPdks(it) as 1 | 2,
        id: it.Id
      }))
      .filter(x => isFinite(x.ms))
      .sort((a,b) => a.ms - b.ms);
    return arr;
  }

  private previousTypeAt(ms: number, extra: Array<{ms: number; pdks: 1|2}> = [], excludeId?: number): (1|2)|null {
    const tl = this.getTimeline(excludeId);
    if (extra?.length) {
      for (const e of extra) {
        if (!isFinite(e.ms)) continue;
        tl.push({ ms: e.ms, pdks: e.pdks, id: -1 }); // sanal
      }
      tl.sort((a,b) => a.ms - b.ms);
    }

    let prev: {ms:number; pdks:1|2}|null = null;
    for (const x of tl) {
      if (x.ms < ms) prev = x;
      else break;
    }
    return prev ? prev.pdks : null;
  }

  // ---------- kuralların tamamını tek kayıt için uygula ----------
  private validateAgainstMainAndPrev(
    ms: number,
    pdks: 1 | 2,
    excludeId?: number,
    extraBeforeCheck: Array<{ms: number; pdks: 1|2}> = []
  ): { ok: true } | { ok: false; msg: string } {
    if (!isFinite(ms)) {
      return { ok: false, msg: this.translateService.instant('Gecersiz_Tarih_Saati') };
    }

    const { inMs, outMs } = this.getMainBounds();

    // 1) Ana girişten önce kayıt eklenemez (<= ana giriş "aynı dakika" zaten ayrıca yakalanıyor ama güvenlik için <=)
    if (inMs != null && ms <= inMs) {
      return { ok: false, msg: this.translateService.instant('Ana_giristen_once_kayit_olamaz') };
    }

    // 2) Ana çıkıştan sonra kayıt eklenemez (>= ana çıkış)
    if (outMs != null && ms >= outMs) {
      return { ok: false, msg: this.translateService.instant('Ana_cikistan_sonra_kayit_olamaz') };
    }

    // 3-4) Önceki kayıt aynı tür ise (Giriş→Giriş, Çıkış→Çıkış) eklenemez
    const prevType = this.previousTypeAt(ms, extraBeforeCheck, excludeId);
    if (prevType != null && prevType === pdks) {
      return { ok: false, msg: this.translateService.instant('Onceki_kayit_aynı_tur') };
    }

    return { ok: true };
  }

  // ---------- submit (add) ----------
  submitAddPanel(): void {
    if (this.addPanelForm.invalid) {
      this.addPanelForm.markAllAsTouched();
      this.toastrService.error(this.translateService.instant('Lütfen gerekli alanları doldurun'));
      return;
    }

    const v = this.addPanelForm.getRawValue();

    if (v.mode === 'single') {
      const terminalId = Number(v.terminalSingle);
      const terminalIdStr = String(terminalId);
      const selectedPdks: 1 | 2 = v.pdks === 2 ? 2 : 1;

      const tarihCombined = this.combineDateAndTime(v.tarihSingle, v.timeSingle);
      const ms = this.parseDdMMyyyyHHmmToMs(tarihCombined);

      // (A) Aynı dakika: tür fark etmeksizin yasak
      if (this.hasAnyAtSameMinute(tarihCombined)) {
        this.toastrService.warning(this.translateService.instant('Ayni_dakikada_kayit_olamaz'));
        return;
      }

      // (B) Ana giriş/çıkış sınırları + (C) önceki kayıtla aynı tür yasağı
      const check = this.validateAgainstMainAndPrev(ms, selectedPdks);
      if (!check.ok) {
        this.toastrService.warning(check.msg);
        return;
      }

      // pending add
      const u = this.genUniqueId();
      this.addOrReplacePending({
        id: null, uniqueid: u, poolid: '', sicilid: null, tip: 1,
        tarih: tarihCombined, terminal: terminalIdStr,
        aciklama: String(v.aciklama ?? '').trim() || null,
      });
      this.pushNewCard(selectedPdks, tarihCombined, terminalId, u);

      this.toastrService.success(this.translateService.instant('İşlem kuyruğa eklendi'));
      this.showAddPanel.set(false);
      return;
    }

    // PAIR (giriş + çıkış)
    const terminalIdIn = Number(v.terminalIn);
    const terminalIdOut = Number(v.terminalOut);
    const terminalIdInStr = String(terminalIdIn);
    const terminalIdOutStr = String(terminalIdOut);

    const tarihIn  = this.combineDateAndTime(v.tarihIn,  v.timeIn);
    const tarihOut = this.combineDateAndTime(v.tarihOut, v.timeOut);
    const msIn  = this.parseDdMMyyyyHHmmToMs(tarihIn);
    const msOut = this.parseDdMMyyyyHHmmToMs(tarihOut);

    // (A) Aynı dakika yasağı (tür fark etmeksizin) + kendi aralarında da eşit olamaz
    if (tarihIn === tarihOut || this.hasAnyAtSameMinute(tarihIn) || this.hasAnyAtSameMinute(tarihOut)) {
      this.toastrService.warning(this.translateService.instant('Ayni_dakikada_kayit_olamaz'));
      return;
    }

    // (B) Ana sınırlar + önceki kayıt aynı tür — giriş için
    const chkIn = this.validateAgainstMainAndPrev(msIn, 1);
    if (!chkIn.ok) {
      this.toastrService.warning(chkIn.msg);
      return;
    }

    // (C) Çıkış için — “önceki” bulurken, yeni giriş de zaman çizelgesine eklenecek gibi düşün
    const chkOut = this.validateAgainstMainAndPrev(msOut, 2, undefined, [{ ms: msIn, pdks: 1 }]);
    if (!chkOut.ok) {
      this.toastrService.warning(chkOut.msg);
      return;
    }

    const uIn = this.genUniqueId();
    const uOut = this.genUniqueId();
    const note = String(v.aciklama ?? '').trim() || null;

    this.addOrReplacePending({
      id: null, uniqueid: uIn, poolid: '', sicilid: null, tip: 1,
      tarih: tarihIn, terminal: terminalIdInStr, aciklama: note,
    });
    this.addOrReplacePending({
      id: null, uniqueid: uOut, poolid: '', sicilid: null, tip: 1,
      tarih: tarihOut, terminal: terminalIdOutStr, aciklama: note,
    });

    this.pushNewCard(1, tarihIn, terminalIdIn, uIn);
    this.pushNewCard(2, tarihOut, terminalIdOut, uOut);

    this.toastrService.success(this.translateService.instant('İşlem kuyruğa eklendi'));
    this.showAddPanel.set(false);
  }

  saveAll(): void {
    const ops = this._pendingOps();
    const order = (t: 1 | 2 | 3) => (t === 2 ? 0 : t === 1 ? 1 : 2);
    const opsSorted = [...ops].sort((a, b) => order(a.tip) - order(b.tip));

    const sicil = String(this.inOutViewData?.sicilid ?? '');

    const opItems = opsSorted.map((op) => ({
      mkodu: 'yek422',
      yon:null,
      uniqueid: op.uniqueid,
      poolid: op.poolid === null || op.poolid === '' ? '' : String(op.poolid),
      sicilid: sicil,
      tip: String(op.tip),
      tarih: op.tip === 1 ? op.tarih : null,
      terminal: op.terminal ?? null,
      aciklama: op.poolid === '' && op.tip === 1 ? op.aciklama : null,
    }));

    const headerDate = formatDate(this.inOutViewData?.mesaitarih, 'dd-MM-yyyy', 'en-US');
    const headerObj = {
      mkodu: 'yek422',
      yon:null,
      uniqueid: this.genUniqueId(),
      poolid: null,
      sicilid: sicil,
      tip: '4' as const,
      tarih: headerDate,
      terminal: null,
      aciklama: null as string | null,
    };

    const payload = [...opItems, headerObj];

    if (payload.length === 1) {
      this.toastrService.info(this.translateService.instant('Gönderilecek işlem yok'));
      return;
    }
    console.log(payload);
    
    this.loading = true;
    this.profileService
      .requestMethod(payload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this._pendingOps.set([]);
          this._newItems.set([]);
          this.getPdksAcc();
          this.toastrService.success(this.translateService.instant('Başarılı'));
        },
        error: () => {
          this.toastrService.error(
            this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
            this.translateService.instant('Hata')
          );
        },
      });
  }

  private pushNewCard(pdks: 1 | 2, tarihCombined: string, terminalId: number, uniqueId: string) {
    const personAd = String(this.inOutViewData?.ad ?? '').trim();
    const personSoyad = String(this.inOutViewData?.soyad ?? '').trim();
    const fullName = [personAd, personSoyad].filter(Boolean).join(' ');

    const [d, t] = tarihCombined.split(' ');
    const [dd, MM, yyyy] = d.split('-').map((x) => parseInt(x, 10));
    const [HH, mm] = t.split(':').map((x) => parseInt(x, 10));
    const iso = new Date(yyyy, (MM || 1) - 1, dd || 1, HH || 0, mm || 0, 0).toISOString();

    const newItem: PdksItem = {
      Id: Math.floor(-Math.random() * 1e9),
      ad: personAd,
      soyad: personSoyad,
      adsoyad: fullName || '—',
      terminal: this.terminalNameById(terminalId) || this.translateService.instant('Yeni Kayıt'),
      terminalid: terminalId,
      userid: this.resolveContextUserId(),
      zaman: iso,
      pdks,
      undelete: true,
      deleted: false,
      mudahale: false,
      automatic: false,
      anagiriscikis: 0,
      isNew: true,
      pendingUniqueId: uniqueId,
    };

    this._newItems.set([...this._newItems(), newItem]);
  }
  private resolveContextUserId(): string {
    const ctx: any = this.inOutViewData ?? {};
    const pick = (...keys: string[]) => {
      for (const k of keys) {
        const v = ctx?.[k];
        if (v !== undefined && v !== null) {
          const s = String(v).trim();
          if (s) return s;
        }
      }
      return '';
    };
    const direct =
      pick('userid', 'userId', 'USERID', 'user_id', 'userID') ||
      (this._dataList().find((r) => String(r?.userid ?? '').trim())?.userid ?? '');
    return String(direct || '').trim();
  }

  private computeInvalidIncoming(list: PdksItem[]): boolean {
    const arr = [...(list ?? [])]
      .filter((x) => !this.isDeletedRec(x))
      .sort((a, b) => new Date(a.zaman).getTime() - new Date(b.zaman).getTime());
    let prev: PdksItem | null = null;
    for (const it of arr) {
      if (prev && prev.pdks === it.pdks) return true;
      prev = it;
    }
    return false;
  }

  displayUid(it: PdksItem): string {
    const real = (it.userid ?? '').toString().trim();
    return real;
  }
  label(pdks: number) {
    return pdks === 1 ? this.translateService.instant('Giriş') : this.translateService.instant('Çıkış');
  }
  piIcon(pdks: number) {
    return pdks === 1 ? 'pi-sign-in' : 'pi-sign-out';
  }
  isIn(pdks: number) {
    return pdks === 1;
  }
  isOut(pdks: number) {
    return pdks === 2;
  }
  trackById(index: number, it: PdksItem): number {
    return it?.Id;
  }
}
