import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { spawn } from 'child_process';
import * as path from 'path';

@Injectable()
export class PdfService {
  private async extractTextFromRemotePdf(url: string): Promise<string> {
    const scriptPath = path.join(
      process.cwd(),
      'src/ai/model/pdf_remote_extraction.py',
    );

    const inputArg = url;

    return new Promise((resolve, reject) => {
      // 🔑 CRITICAL: Spawn the Python process
      const pythonProcess = spawn(
        'e:\\masters-classes\\dcc-classes\\cloud-based-ai-resume-screening\\.venv\\Scripts\\python.exe',
        [scriptPath, inputArg],
      );

      let output = '';
      let error = '';

      // Collect data from the Python script's stdout
      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      // Collect errors from the Python script's stderr
      pythonProcess.stderr.on('data', (data) => {
        error += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error(
            `Python script exited with code ${code}. Error: ${error}`,
          );
          return reject(
            new InternalServerErrorException('AI prediction failed.'),
          );
        }

        try {
          // Assuming the Python script prints JSON to stdout
          resolve(output);
        } catch (e) {
          console.error('Failed to parse Python output:', output);
          reject(new InternalServerErrorException('Invalid AI output format.'));
        }
      });
    });
  }

  /**
   * Main function: downloads PDF from URL, extracts text, and returns clean text.
   * @param url The external URL (e.g., S3 link) to the PDF file.
   * @returns The extracted, clean text from the resume.
   */
  async downloadAndExtractText(url: string): Promise<string> {
    const cleanText = await this.extractTextFromRemotePdf(url);
    return cleanText;
  }
}
