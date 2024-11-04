import { Component } from '@angular/core';
import { RoadworkSVG } from "../common/icons/roadwork.svg";

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [ RoadworkSVG ],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss'
})
export class ConfigComponent {

}
