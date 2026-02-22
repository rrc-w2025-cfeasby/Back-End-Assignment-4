import { Request, Response } from "express";

// Data to work with
let loans = [
  { id: 1, applicant: "John Smith", amount: 50000, status: "pending" },
  { id: 2, applicant: "Sarah Johnson", amount: 150000, status: "under_review" },
];

/**
 * Get all loans
 * 
 * @param req: Request object
 * @param res: Response object
 */
export function getLoans(req: Request, res: Response): void {
    res.status(200).json({success: true, data: loans});
}

/**
 * Get Loan by ID
 * 
 * @param req: Request object
 * @param res: Response object
 */
export function getLoanById(req: Request, res: Response): void {
    const loan_id = Number(req.params.id);
    const loan = loans.find((loan) => loan.id === loan_id);

    if(!loan){
        res.status(404).json({success: false, message: "Loan not found"});
        return;
    }

    res.status(200).json({success: true, data: loan});
}

/**
 * Create Loan
 * 
 * @param req: Request object
 * @param res: Response object
 */
export function createLoan(req: Request, res: Response): void {
    const newLoan = {
        id: loans.length + 1,
        ... req.body
    };

    loans.push(newLoan);

    res.status(201).json({success: true, data: newLoan});
}

/**
 * Update Loan
 * 
 * @param req: Request object
 * @param res: Response object
 */
export function updateLoan(req: Request, res: Response): void {
    const loan_id = Number(req.params.id);
    const index = loans.findIndex((loan) => loan.id === loan_id);

    if(index === -1){
        res.status(404).json({success: false, message: "Loan not found" });
        return;
    }

    loans[index] = { ...loans[index], ... req.body};

    res.status(200).json({success: true, data: loans[index]});
}

/**
 * Delete Loan
 * 
 * @param req: Request object
 * @param res: Response object
 */
export function deleteLoan(req: Request, res: Response): void {
    const loan_id = Number(req.params.id);
    const index = loans.findIndex((loan) => loan.id === loan_id);

    if(index === -1){
        res.status(404).json({success: false, message: "Loan not found"});
        return;
    }

    const deleted = loans.splice(index, 1);

    res.status(200).json({success: true, data: deleted[0]});
}