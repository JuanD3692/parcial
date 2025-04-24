import { Injectable } from '@angular/core';
import { HttpService } from '../../../../shared/service/http.service';
import { Loan, Borrower, LoanDescription } from '../interfaces/ILender';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class LenderService {

    constructor(private http: HttpService) { }


    getLenders() {
        return this.http.get<Loan[]>('lender');
    }

    updateLender(id: string, status: { status: string }): Observable<Loan> {
        return this.http.put(`lender/${id}`, status );
    }

}
