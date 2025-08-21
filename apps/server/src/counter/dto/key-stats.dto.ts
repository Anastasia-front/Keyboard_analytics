export class KeyStatsDto {
  keyName: string;
  count: number;
  prevKey?: string | null;
  nextKey?: string | null;
}
