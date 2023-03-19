import * as S from '@effect/schema/Schema';
import { Path, Checker, CheckResult } from '@recoiljs/refine';
import { SyncStoreKey } from 'lib/schemas';
import { syncEffect } from 'recoil-sync';

/**
 * returns a Refine checker for a given @effect/schema.
 * @param schema schema to use for validation.
 * @returns Refine checker for the given schema.
 */
export function getSchemaChecker<A>(
  schema: S.Schema<A>
): Checker<S.To<S.Schema<A>>> {
  return function SchemaRefineChecker(
    value,
    path
  ): CheckResult<S.To<S.Schema<A>>> {
    try {
      return {
        type: 'success',
        value: S.decode(schema)(value),
        warnings: [],
      };
    } catch (e) {
      return {
        type: 'failure',
        message: String(e),
        path: path ?? new Path(),
      };
    }
  };
}

/**
 * returns a schema sync effect thats bound to a specific store
 * @param storeKey determines which store to sync with
 * @param schema validates data from store using this schema
 * @returns sync effect to be used in atom.effects
 */
export const getSyncEffect = <A>(storeKey: SyncStoreKey, schema: S.Schema<A>) =>
  syncEffect({
    refine: getSchemaChecker(schema),
    storeKey,
  });
