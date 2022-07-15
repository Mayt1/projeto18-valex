import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import dayjs from "dayjs"

import { TransactionTypes, findByTypeAndEmployeeId, insert, findById, update } from "../repositories/cardRepository.js";
import { validateApiKeyFormat } from "./businessService.js";
import * as employeeService from "./employeeService.js";
import * as paymentRepository from "../repositories/paymentRepository.js"
import * as rechargeRepository from "../repositories/rechargeRepository.js"

const CARD_FLAG = "mastercard";
const EXPIRATION_IN_YEARS = 5;
const DATE_CARD_FORMAT = "MM/YY";
const PASSWORD_FORMAT_4_DIGITS = /^[0-9]{4}$/;



export async function create(apiKey: string, employeeId: number, type: TransactionTypes) {

    await validateApiKeyFormat(apiKey)

    const employee = await employeeService.getById(employeeId);

    const hasCard = await findByTypeAndEmployeeId(type, employeeId)
    if(hasCard) {
        throw { type: "conflict", message: "card already exists"}
    }

    const cardData = generateCardData(employee.fullName);

    await insert({ ...cardData, employeeId, isVirtual: false, isBlocked: false, type})

    return null

}

function generateCardData(employeeFullName: string) {
    return { 
        number: faker.finance.creditCardNumber(CARD_FLAG),
        cardholderName: formatCardholderName(employeeFullName),
        securityCode: getSecurityCode(),
        expirationDate: getExpirationDate(EXPIRATION_IN_YEARS, DATE_CARD_FORMAT)
    }
}

function formatCardholderName(employeeFullName: string) {
    const [firstName, ...otherNames] = employeeFullName.split(" ");
    const lastName = otherNames.pop();
    const middleNames = otherNames.filter(filterTwoLetterMiddleName).map(getMiddleNameInitial);

    if(middleNames.length > 0) {
        return [firstName, middleNames, lastName].join(" ").toUpperCase();
    }
    return [firstName, lastName].join(" ").toUpperCase();
}

function getMiddleNameInitial(middleName: string) {
    return middleName[0];
}

function filterTwoLetterMiddleName(middleName: string) {
    if(middleName.length >= 3) {
        return middleName;
    }
}

function getSecurityCode() {
    const securityCode = faker.finance.creditCardCVV();
    console.log("card cvv generated", securityCode);

    const SALT = 9;
    return bcrypt.hashSync(securityCode, SALT)
}

function getExpirationDate(years: number, format:string) {
    return dayjs().add(years, "year").format(format)
}


export async function activate(cardId: number, cvc: string, password: string) {
    const card = await getById(cardId)
    validateExpirationDate(card.expirationDate)
    validateCvc(cvc, card.securityCode);

    const isActive = card.password
    if(isActive){
        throw { type: "bad_request" }
    }
    if( !PASSWORD_FORMAT_4_DIGITS.test(password)){
        throw { type: "bad_request" }
    }

    const SALT = 9;
    const hashPassword = bcrypt.hashSync(password, SALT);

    await update(cardId, { password: hashPassword })



}

export async function validateExpirationDate(expirationDate: string) {
    const today = dayjs().format(DATE_CARD_FORMAT);
    if (dayjs(today).isAfter(dayjs(expirationDate))) {
        throw { type: "bad_request" };
    }
}

export async function getById(cardId: number) {
    const card = await findById(cardId);
    if (!card) {
        throw { type: "not_found" };
    }
    return card
}

export async function validateCvc(cvc: string, cardCVC: string) {
    const isCBCValid = bcrypt.compareSync(cvc, cardCVC);
    if(!isCBCValid) {
        throw { type: "unauthorized" }
    }

}

export async function transactions(cardId: number) {
    const transactions = await paymentRepository.findByCardId(cardId)
    const recharge = await rechargeRepository.findByCardId(cardId)
    const balance = getCardAmount(transactions, recharge)

    return { recharge, transactions, balance}
}

export function getCardAmount(payment: paymentRepository.PaymentWithBusinessName[], recharges: rechargeRepository.Recharge[]) {
    const paymentAmount = payment.reduce(sumTransactionWithAmount, 0);
    const rechargeAmoutn = recharges.reduce(sumTransactionWithAmount, 0);
    return rechargeAmoutn - paymentAmount;
}

function sumTransactionWithAmount (amount: number, transaction) {
    return amount + transaction.amount;
}
