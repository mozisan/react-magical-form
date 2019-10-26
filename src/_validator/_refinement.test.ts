import { expectType } from '../_utils';
import { ApplyRefinement, Refinement } from './_refinement';

describe('ApplyRefinement', () => {
  it('should work correctly', () => {
    type R1 = never;

    expectType<ApplyRefinement<R1, number>>()
      .as<number>()
      .assert();
    expectType<ApplyRefinement<R1, number | undefined>>()
      .as<number | undefined>()
      .assert();
    expectType<ApplyRefinement<R1, string>>()
      .as<string>()
      .assert();
    expectType<ApplyRefinement<R1, string | undefined>>()
      .as<string | undefined>()
      .assert();

    type R2 = Refinement.Factory<number | undefined, number>;

    expectType<ApplyRefinement<R2, number>>()
      .as<number>()
      .assert();
    expectType<ApplyRefinement<R2, number | undefined>>()
      .as<number>()
      .assert();
    expectType<ApplyRefinement<R2, string>>()
      .as<string>()
      .assert();
    expectType<ApplyRefinement<R2, string | undefined>>()
      .as<string | undefined>()
      .assert();

    type R3 = Refinement.Factory<string | undefined, 'foo' | undefined>;

    expectType<ApplyRefinement<R3, number>>()
      .as<number>()
      .assert();
    expectType<ApplyRefinement<R3, number | undefined>>()
      .as<number | undefined>()
      .assert();
    expectType<ApplyRefinement<R3, string>>()
      .as<'foo'>()
      .assert();
    expectType<ApplyRefinement<R3, string | undefined>>()
      .as<'foo' | undefined>()
      .assert();

    type R4 =
      | Refinement.Factory<string | undefined, string>
      | Refinement.Factory<string | undefined, 'foo' | undefined>;

    expectType<ApplyRefinement<R4, string | undefined>>()
      .as<'foo'>()
      .assert();

    type R5 =
      | Refinement.Factory<string | undefined, string>
      | Refinement.Factory<number | undefined, number>
      | Refinement.Factory<boolean | undefined, true>;

    expectType<ApplyRefinement<R5, string | undefined>>()
      .as<string>()
      .assert();
  });
});
