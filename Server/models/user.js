export class User {
    constructor(firstName, lastName, phoneNumber, email, dateOfBirth, password) {
        this._firstName = firstName;
        this._lastName = lastName;
        this._email = email;
        this._phoneNumber = phoneNumber;
        this._dateOfBirth = dateOfBirth;
        this._password = password;
    }

    // Getter and Setter for firstName
    get firstName() {
        return this._firstName;
    }

    set firstName(value) {
        this._firstName = value;
    }

    // Getter and Setter for lastName
    get lastName() {
        return this._lastName;
    }

    set lastName(value) {
        this._lastName = value;
    }

    // Getter and Setter for phoneNumber
    get phoneNumber() {
        return this._phoneNumber;
    }

    set phoneNumber(value) {
        this._phoneNumber = value;
    }

    // Getter and Setter for email
    get email() {
        return this._email;
    }

    set email(value) {
        this._email = value;
    }

    // Getter and Setter for dateOfBirth
    get dateOfBirth() {
        return this._dateOfBirth;
    }

    set dateOfBirth(value) {
        this._dateOfBirth = value;
    }

    // Getter and Setter for password
    get password() {
        return this._password;
    }

    set password(value) {
        this._password = value;
    }
}

