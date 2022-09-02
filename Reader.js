class Reader {
    constructor(buffer, offset = 0) {
        this.buffer = buffer;
        this.dv = new DataView(this.buffer.buffer || this.buffer);
        this.offset = offset;
        return this;
    }
    readString(len) {
        let length = (len || this.dv.getUint8(this.offset++)) - 160,
            str = '';
        for (let i = 0; i < length; i++) str += String.fromCharCode(this.dv.getUint8(this.offset++));
        return str;
    }
    getArrayLegth() {
        return this.dv.getUint8(this.offset++) - 144;
    }
    readData() {
        let type = this.dv.getUint8(this.offset++);
        if (type < 128) return type;
        if (type > 223) return this.dv.getInt8(this.offset - 1);
        if (type === 192) return null;
        if (type === 195) return true;
        if (type === 194) return false;
        if (type > 202 && type < 2010) {
            switch (type) {
                case 203:
                    return (this.offset += 8, this.dv.getFloat64(this.offset - 8));
                case 204:
                    return this.dv.getUint8(this.offset++);
                case 205:
                    return (this.offset += 2, this.dv.getUint16(this.offset - 2));
                case 206:
                    return ((this.offset += 4, this.dv.getUint32(this.offset - 4)));
                case 208:
                    return this.dv.getInt8(this.offset++);
                case 209:
                    return this.dv.getInt16((this.offset += 2) - 2)
            }
        } else if (type > 159 && type < 192) return this.readString(type);
        else if ((type > 143 && type < 160) || type === 220) {
            let length = type === 220 ? this.dv.getUint16((this.offset += 2) - 2) : type - 144;
            let arr = [];
            for (let i = 0; i < length; i++) arr.push(this.readData());
            return arr;
        } else if (type > 127 && type < 144) {
            let length = type - 128,
                json = {};
            for (let i = 0; i < length; i++) json[this.readString()] = this.readData();
            return json;
        } else {
            console.log('idk');
            console.log(this.offset);
            console.log(type);
            console.log(new Uint8Array(this.buffer));
        }
    }
}