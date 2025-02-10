class Account {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    
    verify(password) {
        return this.password === password;
    }
}

module.exports = Account;
