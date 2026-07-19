export type Nullable<T> = T | null;
export type NonNullable<T> = T extends null | undefined ? never : T;
export type Optional<T> = T | undefined;
