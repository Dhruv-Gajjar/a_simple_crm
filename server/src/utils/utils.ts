export function sanitizeInput(input: string): string {
  return input.trim().replace(/[^a-zA-Z0-9-]/g, '');
}
