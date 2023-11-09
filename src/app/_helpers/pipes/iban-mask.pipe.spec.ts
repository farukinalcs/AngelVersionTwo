import { IbanMaskPipe } from './iban-mask.pipe';

describe('IbanMaskPipe', () => {
  it('create an instance', () => {
    const pipe = new IbanMaskPipe();
    expect(pipe).toBeTruthy();
  });
});
