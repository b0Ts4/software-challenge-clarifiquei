import { Component, OnInit } from '@angular/core';
import { EngineerService } from '../../services/engineer.service';

@Component({
  selector: 'app-relatorio',
  imports: [],
  templateUrl: './relatorio.component.html',
  styleUrl: './relatorio.component.css'
})
export class RelatorioComponent implements OnInit {

  engineers: any[] = [];

  constructor(private engineerService: EngineerService) {}

  ngOnInit(): void {
    this.engineerService.getAll().subscribe(data => {
      this.engineers = data as any[];
    });
  }
}
