export interface CloudinaryResult {
  info: {
    secure_url: string;
    original_filename?: string;
    [key: string]: unknown;
  };
  event: string;
}
