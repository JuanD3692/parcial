export interface LoanDescription {
    cuotas: number
    date_initial: string
    date_final: string
}

export interface User {
    id: number
    name: string
    email?: string
    phone?: string
}

export interface Loan {
    id: number
    lender_id: number
    borrower_id: number
    amount: string
    interest_rate: string
    status: "pending" | "approved" | "rejected" | "cancelled" | "completed"
    createdAt: string
    updatedAt: string
    loan_description: LoanDescription[]
    lender: User
    borrower?: User
}

export interface Lender {
    id: number
    name: string
}

export interface CreateBorrowerRequest {
    lender_id: number;
    amount: number;
    cuotas: number;
    date_initial: string;
    date_final: string;
}
