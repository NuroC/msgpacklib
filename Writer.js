class Writer {
    constructor(length = 1, args) {
        length === 0 && (length = 1);
        this.offset = 0;
        this.buffer = new Uint8Array(length);
        this.dv = new DataView(this.buffer.buffer);
        this.setInt(145 + (args ? 1 : 0, !0), !0);
        return this;
    }
    inflate(length = 1) {
        if (this.offset + length < this.buffer.length) return;
        let temp = new Uint8Array(this.buffer.length * 2);
        this.buffer.forEach((data, offset) => temp[offset] = data);
        this.buffer = temp;
        this.dv = new DataView(this.buffer.buffer);
        length + this.offset >= this.buffer.length && this.inflate(length);
    }
    setFloat(float) {
        this.inflate(8);
        this.dv.setFloat64(this.offset, float);
        return this.offset += 8, this
    }
    setInt(int, bypass) {
        if (!bypass && int > 127) {
            this.inflate();
            this.dv.setUint8(this.offset++, 204);
        }
        this.inflate();
        this.dv.setUint8(this.offset++, int);
        return this
    }
    setString(string) {
        if (string.length >= 32) {
            this.setInt(217, !0);
            this.setInt(string.length, !0);
        } else this.setInt(160 + string.length, !0);
        string.split('').forEach(s => this.setInt(s.charCodeAt(), !0));
        return this;
    }
    get arraybuffer() {
        return this.buffer.slice(0, this.offset);
    }
}