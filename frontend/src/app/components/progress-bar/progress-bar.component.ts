import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  imports: [],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.css'
})
export class ProgressBarComponent {
  @Input() usado: number = 0;
  @Input() total: number = 1;

  get percentual(): number {
    return Math.min(100, (this.usado / this.total) * 100);
  }
}
