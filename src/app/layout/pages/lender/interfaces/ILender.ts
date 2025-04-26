export interface Loan {
  id: number;
  lender_id: number;
  borrower_id: number;
  amount: string;
  interest_rate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  loan_description: LoanDescription[];
  lender: Lender;
  borrower: Borrower;
  presmiss: boolean;
}

export interface LoanDescription {
  cuotas: number;
  date_initial: string;
  date_final: string;
}

export interface Lender {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface Borrower {
  id: number;
  name: string;
  email: string;
  phone: string;
}
