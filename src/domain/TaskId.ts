/**
 * @ignore
 */
declare const TaskIdNominality: unique symbol
/**
 * Number type extension
 */
export type TaskId = number & { [TaskIdNominality]: never }