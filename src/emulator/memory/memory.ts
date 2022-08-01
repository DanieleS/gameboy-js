export interface Memory {
  read(address: number): number;
  write(address: number, value: number): void;
}
