export default interface CompareResult {
    result: 'MATCH' | 'DONT MATCH';
    score: number;
}