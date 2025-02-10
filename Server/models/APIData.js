class APIData {
    constructor() {
        this.data = [];
    }

    addData(newData) {
        this.data.push(newData);
    }
    getData() {
        return this.data;
    }
}
module.exports = APIData;
