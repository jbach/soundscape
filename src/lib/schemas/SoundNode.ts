import * as S from '@effect/schema/Schema';

// identifies a single sound node
export const SoundNodeIdSchema = S.string;
export type SoundNodeId = S.To<typeof SoundNodeIdSchema>;

// sound nodes are polymorph
export const SoundNodeTypeSchema = S.literal('root', 'group', 'sound');
export type SoundNodeType = S.To<typeof SoundNodeTypeSchema>;

// represents a path to a soundnode
export const SoundNodePathSchema = S.array(SoundNodeIdSchema);
export type SoundNodePath = S.To<typeof SoundNodePathSchema>;

// sound node state with shallow chrildren
export const SoundNodeStateSchema = S.union(
  S.struct({
    id: SoundNodeIdSchema,
    type: SoundNodeTypeSchema,
    children: S.array(SoundNodeIdSchema),
  }),
  S.null
);
export type SoundNodeState = S.To<typeof SoundNodeStateSchema>;

// a derived soundnode with resolved children
export type SoundNode = {
  readonly id: SoundNodeId;
  readonly type: SoundNodeType;
  readonly children: ReadonlyArray<SoundNode>;
};

export const SoundNodeSchema: S.Schema<SoundNode> = S.lazy(() =>
  S.struct({
    id: SoundNodeIdSchema,
    type: SoundNodeTypeSchema,
    children: S.array(SoundNodeSchema),
  })
);
