import { findById } from "../repositories/employeeRepository";

export async function getById(employeeId: number) {
    const employee = findById(employeeId);

    if(!employee) {
        throw { type: "bad_request" };
    }

    return employee;
}