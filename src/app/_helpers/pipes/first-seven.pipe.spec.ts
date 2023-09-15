import { FirstSevenPipe } from './first-seven.pipe';

describe('FirstSevenPipe', () => {
  it('create an instance', () => {
    const pipe = new FirstSevenPipe();
    expect(pipe).toBeTruthy();
  });
});
