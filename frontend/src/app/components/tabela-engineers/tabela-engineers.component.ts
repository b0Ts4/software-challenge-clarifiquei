import { Component } from '@angular/core';
import { EngineerService } from '../../services/engineer.service';

@Component({
  selector: 'app-tabela-engineers',
  imports: [],
  templateUrl: './tabela-engineers.component.html',
  styleUrl: './tabela-engineers.component.css'
})
export class TabelaEngineersComponent {
  engineers: any[] = [];

  constructor(private engineerService: EngineerService) {}

  ngOnInit(): void {
    this.engineerService.getAll().subscribe(data => {
      this.engineers = data as any[];
    });
  }
}
