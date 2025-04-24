export interface LoanDescription {
    cuotas: number
    date_initial: string
    date_final: string
}

export interface Borrower {
    id: number
    name: string
    email: string
    phone: string
}

export interface Loan {
    id: number
    lender_id: number
    borrower_id: number
    amount: string
    interest_rate: string
    status: string
    createdAt: string
    updatedAt: string
    loan_description: LoanDescription[]
    borrower: Borrower
}
