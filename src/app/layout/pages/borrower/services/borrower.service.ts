import { Injectable } from '@angular/core';
import { HttpService } from '../../../../shared/service/http.service';
import { Loan, Lender, CreateBorrowerRequest } from '../interfaces/IBorrower';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class BorrowerService {

    constructor(private http: HttpService) { }


    getBorrower() {
        return this.http.get<{ loans: Loan[]; lenders: Lender[] }>('borrower');
    }

    createBorrower(data: CreateBorrowerRequest): Observable<Loan> {
        return this.http.post<Loan>('borrower', data);
    }

    cancelBorrower(id: string) {
        return this.http.delete(`borrower/${id}`);
    }

}

