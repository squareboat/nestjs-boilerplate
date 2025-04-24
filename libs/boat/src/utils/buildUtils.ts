import { Injectable } from "@nestjs/common";
import { promises as fs } from "fs";


@Injectable()
export class BuildUtils{
    static async deleteFile(path: string): Promise<void> {
        try {
          await fs.unlink(path);
        } catch (error) {
          console.error('Error deleting file:', error);
        }
      }
    
      static async readFile(path: string): Promise<string | undefined> {
        try {
          const data = await fs.readFile(path, 'utf8');
          return data;
        } catch (error) {
          console.error('Error reading file:', error);
        }
      }
    
      static async writeFile(path: string, data: string): Promise<void> {
        try {
          await fs.writeFile(path, data);
        } catch (error) {
          console.error('Error writing file:', error);
        }
      }
}