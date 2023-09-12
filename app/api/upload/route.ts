import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileName = file.name;
  const filePath = `./public/contracts/${fileName}`;

  await writeFile(filePath, buffer);

  // Конструируем URL-адрес файла на основе его имени или идентификатора
  // const baseUrl = 'http://localhost:3000';
  // const fileUrl = `${baseUrl}/Admin/${encodeURIComponent(fileName)}`;




  return NextResponse.json({ path: fileName });

}