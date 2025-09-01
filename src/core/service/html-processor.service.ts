import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { ImageService } from './image.service';

@Injectable()
export class HtmlProcessorService {
    constructor(private readonly imageService: ImageService) {}

    async processHtmlImages(html: string, uploadPath: string): Promise<string> {
        const $ = cheerio.load(html);
        const imgElements = $('img');

        for (let i = 0; i < imgElements.length; i++) {
            const img = imgElements[i];
            const src = $(img).attr('src');

            if (src && src.startsWith('data:image')) {
                try {
                    const imagePath = await this.imageService.saveBase64Image(src, uploadPath);
                    $(img).attr('src', imagePath);
                } catch (error) {
                    console.error('Error processing image:', error);
                    $(img).remove();
                }
            }
        }

        return $.html();
    }

    async deleteImagesFromHtml(html: string): Promise<void> {
        const $ = cheerio.load(html);
        const imgElements = $('img');
        const imageUrls: string[] = [];
        for (let i = 0; i < imgElements.length; i++) {
            const img = imgElements[i];
            const src = $(img).attr('src');

            if (src && !src.startsWith('data:image')) {
                imageUrls.push(src);
            }
        }
        if (imageUrls.length > 0) {
            try {
                await this.imageService.deleteMultipleFiles(imageUrls);
            } catch (error) {
                console.error('Error deleting images from HTML:', error);
            }
        }
    }

    async extractImageUrls(html: string): Promise<string[]> {
        const $ = cheerio.load(html);
        const imageUrls: string[] = [];

        $('img').each((_, element) => {
            const src = $(element).attr('src');
            if (src && !src.startsWith('data:image')) {
                imageUrls.push(src);
            }
        });

        return imageUrls;
    }

    async processAndExtractImages(html: string, uploadPath: string): Promise<{
        processedHtml: string;
        imageUrls: string[];
    }> {
        const $ = cheerio.load(html);
        const imgElements = $('img');
        const savedImageUrls: string[] = [];

        for (let i = 0; i < imgElements.length; i++) {
            const img = imgElements[i];
            const src = $(img).attr('src');

            if (src && src.startsWith('data:image')) {
                try {
                    const imagePath = await this.imageService.saveBase64Image(src, uploadPath);
                    $(img).attr('src', imagePath);
                    savedImageUrls.push(imagePath);
                } catch (error) {
                    console.error('Error processing image:', error);
                    $(img).remove();
                }
            } else if (src && !src.startsWith('data:image')) {
                // اگر تصویر از قبل آپلود شده، URL آن را ذخیره کنید
                savedImageUrls.push(src);
            }
        }

        return {
            processedHtml: $.html(),
            imageUrls: savedImageUrls
        };
    }

    async extractTextContent(html: string): Promise<string> {
        const $ = cheerio.load(html);
        return $.text();
    }

    async countImages(html: string): Promise<number> {
        const $ = cheerio.load(html);
        return $('img').length;
    }

    async replaceImageUrls(html: string, oldBaseUrl: string, newBaseUrl: string): Promise<string> {
        const $ = cheerio.load(html);

        $('img').each((_, element) => {
            const src = $(element).attr('src');
            if (src && src.startsWith(oldBaseUrl)) {
                const newSrc = src.replace(oldBaseUrl, newBaseUrl);
                $(element).attr('src', newSrc);
            }
        });

        return $.html();
    }
}
