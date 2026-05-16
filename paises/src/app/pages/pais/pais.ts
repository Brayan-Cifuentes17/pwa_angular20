import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PaisesService } from '../../services/paises';
import { ActivatedRoute, Router } from '@angular/router';
import { PaisInterface } from '../../interfaces/pais.interface';

@Component({
  selector: 'app-pais',
  imports: [],
  templateUrl: './pais.html',
  styleUrl: './pais.css',
})
export class Pais implements OnInit {
  pais?: PaisInterface;

  constructor(
    public paisesService: PaisesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/']);
      return;
    }

    this.paisesService.getPaisByID(id).then(pais => {
      if (!pais) {
        this.router.navigate(['/']);
        return;
      }
      this.pais = pais;
      this.cd.detectChanges();
    });
  }
}
