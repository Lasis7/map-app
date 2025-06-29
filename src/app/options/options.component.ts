import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-options',
  imports: [MatSliderModule, FormsModule],
  templateUrl: './options.component.html',
  styleUrl: './options.component.css',
})
export class OptionsComponent {
  min: number = 700;
  max: number = 2000;
  step: number = 100;
  resetWarningVisible: boolean = false;

  @Input() value!: number;
  @Output() sliderValue = new EventEmitter<string>();
  @Output() scoreReset = new EventEmitter<string>();
  @Output() clickOutsideSettings = new EventEmitter<boolean>();

  newRadius(value: string) {
    this.sliderValue.emit(value);
  }

  resetWarningVisibility() {
    this.resetWarningVisible = !this.resetWarningVisible;
  }

  resetScore() {
    this.scoreReset.emit('0');
    this.resetWarningVisibility();
  }

  clickedOutside() {
    this.clickOutsideSettings.emit(false);
  }

  formatLabel(value: number): string {
    if (value <= 900) {
      return `${value}m`;
    } else {
      return `${value / 1000}km`;
    }
  }
}
