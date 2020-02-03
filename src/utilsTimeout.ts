export default function(size: number): Promise<number> {
  return new Promise(resolve => setTimeout(resolve, size));
}
