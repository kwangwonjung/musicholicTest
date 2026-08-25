// src/types/record.ts
export interface RecordType {
  id: number;
  name: string;
  date: string;
  title: string;
  score: number;
  time: string;
  status: '사용' | '미사용';
}