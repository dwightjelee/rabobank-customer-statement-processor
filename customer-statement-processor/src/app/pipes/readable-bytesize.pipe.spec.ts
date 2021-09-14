import { ReadableBytesizePipe } from './readable-bytesize.pipe';

describe('ReadableBytesize pipe', () => {
    const pipe = new ReadableBytesizePipe();

    it('should convert to Bytes', () => {
        const result = pipe.transform(100);
        expect(result).toEqual('100 Bytes');
    });

    it('should convert to KB', () => {
        const result = pipe.transform(1024);
        expect(result).toEqual('1 KB');
    });

    it('should convert to MB', () => {
        const result = pipe.transform(1048576);
        expect(result).toEqual('1 MB');
    });

    it('should convert to GB', () => {
        const result = pipe.transform(1073741824);
        expect(result).toEqual('1 GB');
    });
});
