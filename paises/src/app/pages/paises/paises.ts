import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PaisInterface } from '../../interfaces/pais.interface';
import { PaisesService } from '../../services/paises'


@Component({
  selector: 'app-paises',
  imports: [RouterLink, CommonModule],
  templateUrl: './paises.html',
  styleUrl: './paises.css',
})

export class Paises implements OnInit {

  paises: PaisInterface[] = [];

  constructor(public paisService: PaisesService,
    private cd: ChangeDetectorRef
  ) {

  }

  ngOnInit() {
    this.paisService.getPaises().then(paises => {
      this.paises = paises;
      this.cd.detectChanges();
    })
  }
}

