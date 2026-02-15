export interface UnitMeasure {
  id: number;
  category: string;
  code: string;
  name: string;
  symbol: string;
  description: string;
  isBaseUnit: boolean;
}

export interface UnitMeasureGrouped {
  category: string;
  items: UoMGroupItem[];
}

export type UoMGroupItem = Pick<UnitMeasure, 'id' | 'code' | 'name' | 'symbol' | 'isBaseUnit'>;
