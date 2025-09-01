import {BadRequestException, Injectable} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class ImageService {
    private readonly uploadRoot = 'uploads'; // ریشه اصلی آپلود

    async saveBase64Image(base64String: string, folder: string): Promise<string> {
        if (!base64String) {
            throw new BadRequestException('داده تصویر ارائه نشده است');
        }

        if (!base64String.startsWith('data:image')) {
            return base64String;
        }

        const matches = base64String.match(/^data:image\/(\w+);base64,/);
        if (!matches) throw new BadRequestException('ساختار Base64 نامعتبر است');

        const extension = matches[1];
        const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
        const filename = `${crypto.randomUUID()}.${extension}`;
        const uploadDir = path.join(this.uploadRoot, 'images', folder);

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, filename);
        await fs.promises.writeFile(filePath, base64Data, 'base64');

        return `${process.env.LOCALHOST}/${this.uploadRoot}/images/${folder}/${filename}`;
    }

    async saveBase64Video(base64String: string, folder: string): Promise<string> {
        if (!base64String.startsWith('data:video')) {
            throw new BadRequestException('فرمت ویدیو معتبر نیست');
        }

        const matches = base64String.match(/^data:video\/(\w+);base64,/);
        if (!matches) throw new BadRequestException('ساختار Base64 نامعتبر است');

        const extension = matches[1];
        if (!['mp4', 'webm', 'ogg'].includes(extension)) {
            throw new BadRequestException('فرمت ویدیو مجاز نیست');
        }

        const base64Data = base64String.replace(/^data:video\/\w+;base64,/, '');
        const maxSizeMB = 100;
        const sizeInBytes = (base64Data.length * 3) / 4;

        if (sizeInBytes > maxSizeMB * 1024 * 1024) {
            throw new BadRequestException('حجم فایل بیش از حد مجاز است');
        }

        const filename = `${crypto.randomUUID()}.${extension}`;
        const uploadDir = path.join(this.uploadRoot, 'videos', folder);

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, filename);
        await fs.promises.writeFile(filePath, base64Data, 'base64');

        return `${process.env.LOCALHOST}/${this.uploadRoot}/videos/${folder}/${filename}`;
    }

    async deleteFile(fileUrl: string): Promise<void> {
        try {
            const filePath = this.urlToFilePath(fileUrl);

            if (!fs.existsSync(filePath)) {
                console.warn(`فایل مورد نظر یافت نشد: ${filePath}`);
                return;
            }

            await fs.promises.unlink(filePath);
            await this.cleanEmptyDirectories(filePath);

        } catch (error) {
            console.error('خطا در حذف فایل:', error);
            throw new BadRequestException('خطا در حذف فایل');
        }
    }

    async deleteMultipleFiles(fileUrls: string | string[]): Promise<void> {
        try {
            const urlsArray = Array.isArray(fileUrls) ? fileUrls : fileUrls.split(',');

            for (const url of urlsArray) {
                const trimmedUrl = url.trim();
                if (trimmedUrl) {
                    await this.deleteFile(trimmedUrl);
                }
            }
        } catch (error) {
            console.error('خطا در حذف فایل‌های متعدد:', error);
            throw new BadRequestException('خطا در حذف فایل‌ها');
        }
    }

    private urlToFilePath(url: string): string {
        try {
            const urlObj = new URL(url);
            const fullPath = urlObj.pathname;
            return fullPath.startsWith('/') ? fullPath.substring(1) : fullPath;
        } catch (error) {
            if (url.includes(this.uploadRoot)) {
                const parts = url.split(this.uploadRoot);
                if (parts.length > 1) {
                    return path.join(this.uploadRoot, parts[1].replace(/^\//, ''));
                }
            }

            throw new BadRequestException('آدرس فایل نامعتبر است');
        }
    }

    private async cleanEmptyDirectories(filePath: string): Promise<void> {
        try {
            let currentDir = path.dirname(filePath);
            while (currentDir !== this.uploadRoot && currentDir.startsWith(this.uploadRoot)) {
                const files = await fs.promises.readdir(currentDir);

                if (files.length === 0) {
                    await fs.promises.rmdir(currentDir);
                    currentDir = path.dirname(currentDir);
                } else {
                    break;
                }
            }
        } catch (error) {
            console.error('Error in cleanEmptyDirectories:', error);
        }
    }

    extractFilenamesFromUrls(urlsString: string): string[] {
        if (!urlsString) return [];

        const urls = urlsString.split(',');
        const filenames: string[] = [];

        for (const url of urls) {
            const trimmedUrl = url.trim();
            if (trimmedUrl) {
                const filename = this.extractFilenameFromUrl(trimmedUrl);
                if (filename) {
                    filenames.push(filename);
                }
            }
        }

        return filenames;
    }

    private extractFilenameFromUrl(url: string): string | null {
        try {
            const urlObj = new URL(url);
            const pathname = urlObj.pathname;
            return path.basename(pathname);
        } catch {
            const parts = url.split('/');
            return parts[parts.length - 1];
        }
    }
}
