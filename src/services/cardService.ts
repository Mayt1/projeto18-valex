import { faker } from "@faker-js/faker";
import crypt from "crypt";
import dayjs from "dayjs"

import { TransactionTypes, findByTypeAndEmployeeId, insert } from "../repositories/cardRepository.js";
import { validateApiKeyFormat } from "./businessService.js";
import { getById } from "./employeeService.js";

const CARD_FLAG = "mastercard";
const EXPIRATION_IN_YEARS = 5;
const DATE_CARD_FORMAT = "MM/YY";
const PASSWORD_FORMAT_4_DIGITS = /^[0-9]{4}$/;



export async function create(apiKey: string, employeeId: number, type: TransactionTypes) {

    await validateApiKeyFormat(apiKey)

    const employee = await getById(employeeId);

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
    return crypt.hashSync(securityCode, SALT)
}

function getExpirationDate(years: number, format:string) {
    return dayjs().add(years, "year").format(format)
}