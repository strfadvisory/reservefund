import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';
import { Readable } from 'stream';

const BUCKET_NAME = 'logos';
const FILES_BUCKET = 'files';

let clientPromise: Promise<MongoClient> | null = null;

function getClient() {
  if (!clientPromise) {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error('MONGO_URI not set');
    clientPromise = new MongoClient(uri).connect();
  }
  return clientPromise;
}

async function getBucket() {
  const client = await getClient();
  const db = client.db();
  return new GridFSBucket(db, { bucketName: BUCKET_NAME });
}

export async function uploadLogo(
  buffer: Buffer,
  filename: string,
  contentType: string,
  metadata: Record<string, unknown> = {}
): Promise<string> {
  const bucket = await getBucket();
  return new Promise((resolve, reject) => {
    const stream = bucket.openUploadStream(filename, {
      metadata: { ...metadata, contentType },
    });
    Readable.from(buffer).pipe(stream).on('error', reject).on('finish', () => {
      resolve(stream.id.toString());
    });
  });
}

export async function getLogo(id: string) {
  const bucket = await getBucket();
  const _id = new ObjectId(id);
  const files = await bucket.find({ _id }).toArray();
  if (!files.length) return null;
  const file = files[0];
  const chunks: Buffer[] = [];
  await new Promise<void>((resolve, reject) => {
    bucket
      .openDownloadStream(_id)
      .on('data', (c) => chunks.push(c as Buffer))
      .on('error', reject)
      .on('end', () => resolve());
  });
  return {
    buffer: Buffer.concat(chunks),
    contentType: (file.metadata?.contentType as string) || 'application/octet-stream',
    filename: file.filename,
  };
}

async function getFilesBucket() {
  const client = await getClient();
  return new GridFSBucket(client.db(), { bucketName: FILES_BUCKET });
}

export async function uploadFile(
  buffer: Buffer,
  filename: string,
  contentType: string,
  metadata: Record<string, unknown> = {}
): Promise<string> {
  const bucket = await getFilesBucket();
  return new Promise((resolve, reject) => {
    const stream = bucket.openUploadStream(filename, {
      metadata: { ...metadata, contentType },
    });
    Readable.from(buffer).pipe(stream).on('error', reject).on('finish', () => {
      resolve(stream.id.toString());
    });
  });
}

export async function deleteFile(id: string) {
  const bucket = await getFilesBucket();
  try {
    await bucket.delete(new ObjectId(id));
  } catch {}
}

export async function deleteLogo(id: string) {
  const bucket = await getBucket();
  try {
    await bucket.delete(new ObjectId(id));
  } catch {
    // ignore missing files
  }
}
