export interface IIdGenerator {
  nextId(): string;

  getId(): number;

  setId(value: number): void;
}
