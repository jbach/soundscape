import * as S from '@effect/schema/Schema';

export const SyncStoreKeySchema = S.literal('userSettings', 'shared', 'hash');
export type SyncStoreKey = S.To<typeof SyncStoreKeySchema>;
