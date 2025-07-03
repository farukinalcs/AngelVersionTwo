import { Component } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-patrolreport',
  standalone: true,
  imports: [],
  templateUrl: './patrolreport.component.html',
  styleUrl: './patrolreport.component.scss'
})
export class PatrolreportComponent {
  private ngUnsubscribe = new Subject();
}
