import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  computed,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

type SortDir = 'asc' | 'desc';

export interface ColumnDef {
  key: string;
  header: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
  hideOnMobile?: boolean; // true ise mobilde gizlenir

  // Yeni alanlar:
  type?: 'text' | 'number' | 'date';
  dateOptions?: Intl.DateTimeFormatOptions; // tarih formatını özelleştir
  clickable?: boolean; // hücre tıklanabilir mi?
}

@Component({
  selector: 'app-modern-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card shadow-sm mb-3" style="border: 1px solid #ed1b24;">
      <!-- Header -->
      <div
        class="card-header d-flex align-items-center gap-2 sticky-top bg-danger"
        style="z-index:0!important"
      >
        <div class="fw-semibold text-white">{{ title }}</div>
        <div class="ms-auto d-flex align-items-center gap-2">
          <input
            [ngModel]="query()"
            (ngModelChange)="onQueryChange($event)"
            type="search"
            class="form-control form-control-sm"
            placeholder="Ara..."
            style="max-width: 220px"
          />
          <select
            [ngModel]="pageSize()"
            (ngModelChange)="onPageSizeChange($event)"
            class="form-select form-select-sm"
            style="max-width: 130px"
          >
            <option *ngFor="let s of pageSizeOptions" [value]="s">
              {{ s }}/sayfa
            </option>
          </select>
        </div>
      </div>

      <!-- Skeleton -->
      <div *ngIf="loading; else tableTpl" class="card-body">
        <div class="skeleton mb-2"></div>
        <div class="skeleton mb-2"></div>
        <div class="skeleton mb-2"></div>
        <div class="skeleton mb-0"></div>
      </div>

      <!-- Table / Cards -->
      <ng-template #tableTpl>
        <!-- Desktop Table -->
        <div class="table-responsive d-none d-sm-block">
          <table class="table table-sm align-middle mb-0">
            <thead
              class="table-light"
              style="position: sticky; top: 0; z-index: 0;"
            >
              <tr>
                <th
                  *ngFor="let c of columns"
                  [style.width]="c.width || null"
                  [class.text-center]="c.align === 'center'"
                  [class.text-end]="c.align === 'right'"
                  [class.d-none]="c.hideOnMobile"
                  [class.d-sm-table-cell]="c.hideOnMobile"
                >
                  <button
                    *ngIf="c.sortable; else plain"
                    class="btn btn-link btn-sm text-decoration-none p-0"
                    (click)="toggleSort(c.key)"
                  >
                    <span>{{ c.header }}</span>
                    <small
                      class="opacity-75 ms-1"
                      *ngIf="sortKey() === c.key"
                      >{{ sortDir() === 'asc' ? '▲' : '▼' }}</small
                    >
                  </button>
                  <ng-template #plain>{{ c.header }}</ng-template>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                *ngFor="
                  let row of pageRows();
                  let i = index;
                  trackBy: trackByIndex
                "
                class="table-row-hover"
              >
                <td
                  *ngFor="let c of columns"
                  [class.text-center]="c.align === 'center'"
                  [class.text-end]="c.align === 'right'"
                  [class.d-none]="c.hideOnMobile"
                  [class.d-sm-table-cell]="c.hideOnMobile"
                >
                  <ng-container [ngSwitch]="c.type">
                    <!-- DATE tipi -->
                    <ng-container *ngSwitchCase="'date'">
                      <button
                        *ngIf="c.clickable"
                        type="button"
                        class="btn btn-link btn-sm p-0 align-baseline"
                        (click)="onDateClick(row[c.key], row, c)"
                        [title]="formatDateTooltip(row[c.key])"
                      >
                        {{ formatDate(row[c.key], c) }}
                      </button>
                      <span
                        *ngIf="!c.clickable"
                        [title]="formatDateTooltip(row[c.key])"
                      >
                        {{ formatDate(row[c.key], c) }}
                      </span>
                    </ng-container>

                    <!-- DİĞER tipler -->
                    <ng-container *ngSwitchDefault>
                      <span
                        (click)="onCellClick(row[c.key], row, c)"
                        [class.cursor-pointer]="c.clickable"
                      >
                        {{ formatCell(row[c.key]) }}
                      </span>
                    </ng-container>
                  </ng-container>
                </td>
              </tr>
              <tr *ngIf="pageRows().length === 0">
                <td
                  [attr.colspan]="columns.length"
                  class="text-center text-muted py-4"
                >
                  Kayıt bulunamadı
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards -->
        <div class="d-block d-sm-none">
          <div
            *ngFor="let row of pageRows(); trackBy: trackByIndex"
            class="border-bottom p-3"
          >
            <div class="row g-2">
              <div *ngFor="let c of columns" [class.d-none]="c.hideOnMobile">
                <div class="text-muted small">{{ c.header }}</div>
                <div class="fw-medium">
                  <ng-container [ngSwitch]="c.type">
                    <span *ngSwitchCase="'date'">{{
                      formatDate(row[c.key], c)
                    }}</span>
                    <span *ngSwitchDefault>{{ formatCell(row[c.key]) }}</span>
                  </ng-container>
                </div>
              </div>
            </div>
          </div>
          <div
            *ngIf="pageRows().length === 0"
            class="text-center text-muted p-3"
          >
            Kayıt bulunamadı
          </div>
        </div>
      </ng-template>

      <!-- Footer -->
      <div class="card-footer d-flex align-items-center gap-2">
        <div class="text-muted small">
          {{ startIndex() + 1 }}–{{ endIndex() }} / {{ total() }}
        </div>
        <div class="ms-auto d-flex align-items-center gap-2">
          <button
            class="btn btn-outline-secondary btn-sm"
            (click)="prevPage()"
            [disabled]="pageIndex() === 0"
          >
            Önceki
          </button>
          <div class="small">{{ pageIndex() + 1 }} / {{ totalPages() }}</div>
          <button
            class="btn btn-outline-secondary btn-sm"
            (click)="nextPage()"
            [disabled]="pageIndex() + 1 >= totalPages()"
          >
            Sonraki
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .box {
        width: 60vmin;
        height: 50vmin;
        display: grid;
        place-content: center;
        color: white;
        text-shadow: 0 1px 0 #000;

        --border-angle: 0turn; // For animation.
        --main-bg: conic-gradient(
          from var(--border-angle),
          #213,
          #112 5%,
          #112 60%,
          #213 95%
        );

        border: solid 5px transparent;
        border-radius: 2em;
        --gradient-border: conic-gradient(
          from var(--border-angle),
          transparent 25%,
          #08f,
          #f03 99%,
          transparent
        );

        background: var(--main-bg) padding-box,
          var(--gradient-border) border-box, var(--main-bg) border-box;

        background-position: center center;

        animation: bg-spin 3s linear infinite;
        @keyframes bg-spin {
          to {
            --border-angle: 1turn;
          }
        }

        &:hover {
          animation-play-state: paused;
        }
      }

      @property --border-angle {
        syntax: '<angle>';
        inherits: true;
        initial-value: 0turn;
      }
      table td:first-child,
      table th:first-child {
        padding-left: 12px;
      }
      :host {
        display: block;
      }
      .table-row-hover:hover {
        background: rgba(0, 0, 0, 0.03);
      }
      .skeleton {
        height: 36px;
        border-radius: 0.5rem;
        background: linear-gradient(90deg, #eee, #f5f5f5, #eee);
        background-size: 200% 100%;
        animation: sk 1.2s ease-in-out infinite;
      }
      @keyframes sk {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }
      .cursor-pointer {
        cursor: pointer;
      }
    `,
  ],
})
export class ModernTableComponent {
  @Input() title = 'Veriler';
  @Input() columns: ColumnDef[] = [];
  @Input() set rows(value: any[]) {
    this._rows.set(Array.isArray(value) ? value : []);
  }
  @Input() pageSizeOptions = [10, 25, 50];
  @Input() loading = false;

  @Output() sortChange = new EventEmitter<{ key: string; dir: SortDir }>();
  @Output() queryChange = new EventEmitter<string>();
  @Output() pageChange = new EventEmitter<{ index: number; size: number }>();
  @Output() dateClick = new EventEmitter<{
    value: Date;
    row: any;
    key: string;
  }>();
  @Output() cellClick = new EventEmitter<{
    value: any;
    row: any;
    col: ColumnDef;
  }>();

  protected _rows = signal<any[]>([]);
  query = signal<string>('');
  sortKey = signal<string | null>(null);
  sortDir = signal<SortDir>('asc');
  pageIndex = signal<number>(0);
  pageSize = signal<number>(this.pageSizeOptions[0] ?? 10);

  // Derived
  filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this._rows();
    const keys = this.columns.map((c) => c.key);
    return this._rows().filter((r) =>
      keys.some((k) =>
        String(r?.[k] ?? '')
          .toLowerCase()
          .includes(q)
      )
    );
  });

  sorted = computed(() => {
    const key = this.sortKey();
    if (!key) return this.filtered();
    const dir = this.sortDir();
    return [...this.filtered()]
      .map((v, i) => [v, i] as const)
      .sort((a, b) => {
        const av = a[0]?.[key],
          bv = b[0]?.[key];
        const cmp = this.compare(av, bv);
        return dir === 'asc' ? cmp || a[1] - b[1] : -(cmp || a[1] - b[1]);
      })
      .map((x) => x[0]);
  });

  total = computed(() => this.sorted().length);
  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.total() / this.pageSize()))
  );
  startIndex = computed(() =>
    Math.min(this.pageIndex() * this.pageSize(), Math.max(0, this.total() - 1))
  );
  endIndex = computed(() =>
    Math.min(this.startIndex() + this.pageSize(), this.total())
  );
  pageRows = computed(() =>
    this.sorted().slice(this.startIndex(), this.endIndex())
  );

  // Actions
  onQueryChange(v: string) {
    this.query.set(v);
    this.pageIndex.set(0);
    this.queryChange.emit(v);
  }
  onPageSizeChange(v: any) {
    const n = Number(v);
    this.pageSize.set(Number.isFinite(n) ? n : this.pageSizeOptions[0] ?? 10);
    this.pageIndex.set(0);
    this.pageChange.emit({ index: this.pageIndex(), size: this.pageSize() });
  }
  toggleSort(key: string) {
    if (this.sortKey() !== key) {
      this.sortKey.set(key);
      this.sortDir.set('asc');
    } else {
      this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
    }
    this.sortChange.emit({ key, dir: this.sortDir() });
  }
  prevPage() {
    if (this.pageIndex() > 0) {
      this.pageIndex.set(this.pageIndex() - 1);
      this.pageChange.emit({ index: this.pageIndex(), size: this.pageSize() });
    }
  }
  nextPage() {
    if (this.pageIndex() + 1 < this.totalPages()) {
      this.pageIndex.set(this.pageIndex() + 1);
      this.pageChange.emit({ index: this.pageIndex(), size: this.pageSize() });
    }
  }

  // Utils
  trackByIndex = (i: number) => i;

  // Hücre formatları
  formatCell(v: unknown): string {
    if (v == null) return '—';
    if (typeof v === 'number') return Intl.NumberFormat().format(v);
    if (v instanceof Date)
      return new Intl.DateTimeFormat('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(v);
    return String(v);
  }

  // Tarih yardımcıları
  parseDate(value: any): Date | null {
    if (value instanceof Date) return value;
    if (typeof value === 'number') return new Date(value); // epoch ms
    if (typeof value === 'string') {
      const d = new Date(value);
      if (!isNaN(d.getTime())) return d;
    }
    return null;
  }

  formatDate(value: any, col?: ColumnDef): string {
    const d = this.parseDate(value);
    if (!d) return this.formatCell(value);
    const opts: Intl.DateTimeFormatOptions = col?.dateOptions ?? {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Intl.DateTimeFormat('tr-TR', opts).format(d);
  }

  formatDateTooltip(value: any): string {
    const d = this.parseDate(value);
    return d ? d.toISOString() : String(value ?? '—');
  }

  onDateClick(value: any, row: any, col: ColumnDef) {
    const d = this.parseDate(value);
    if (d) this.dateClick.emit({ value: d, row, key: col.key });
  }

  onCellClick(value: any, row: any, col: ColumnDef) {
    if (col.type === 'date') return; // date için ayrı event var
    if (col.clickable) this.cellClick.emit({ value, row, col });
  }

  // Karşılaştırma
  compare(a: any, b: any) {
    if (a == null && b == null) return 0;
    if (a == null) return -1;
    if (b == null) return 1;
    if (typeof a === 'number' && typeof b === 'number') return a - b;
    return String(a).localeCompare(String(b), undefined, {
      numeric: true,
      sensitivity: 'base',
    });
  }
}
