import test from './decorators/some-func';

export default class TestClass {
  @test()
  some(): void {}
}
