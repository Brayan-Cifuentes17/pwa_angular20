import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaisInterface } from "../interfaces/pais.interface"


@Injectable({
  providedIn: 'root',
})
export class PaisesService {

  private paises: PaisInterface[] = [];

  constructor(private http: HttpClient) { }

  getPaises(): Promise<PaisInterface[]> {
    if (this.paises.length > 0) {
      return Promise.resolve(this.paises);
    } else {
      return new Promise((resolve, reject) => {
        this.http.get<PaisInterface[]>('https://api.countrylayer.com/v2/lang/es?access_key=cf96a6319a7545ede4d2a8b3f9aa1f45')
          .subscribe((paises: PaisInterface[]) => {
            console.log(paises);
            this.paises = paises;
            resolve(paises);
          });
      });
    }
  }
  getPaisByID(id: string) {
    if (this.paises.length > 0) {
      const pais = this.paises.find(pais => pais.alpha3Code === id);
      return Promise.resolve(pais);
    }
    return this.getPaises().then(paises => {

      const pais = paises.find(pais => pais.alpha3Code === id);
      return Promise.resolve(pais);

    });

  }
}
