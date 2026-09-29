import { items } from '@wix/data';
import { auth } from '@wix/essentials';

const NS = '@admin14744/forms-pdf-generator';
export const collection = (name: string) => `${NS}/${name}`;

export type StoredItem = { _id: string; instanceId: string; [key: string]: unknown };

const query = auth.elevate(items.query);
const insert = auth.elevate(items.insert);
const update = auth.elevate(items.update);
const remove = auth.elevate(items.remove);

export async function listItems(name: string, instanceId: string, limit = 50): Promise<StoredItem[]> {
  const result = await query(collection(name)).eq('instanceId', instanceId).limit(limit).find();
  return result.items as StoredItem[];
}

export async function countItems(name: string, instanceId: string, field?: string, value?: string): Promise<number> {
  let builder = query(collection(name)).eq('instanceId', instanceId);
  if (field && value !== undefined) builder = builder.eq(field, value);
  return await builder.count();
}

export async function findOne(name: string, instanceId: string, field: string, value: string): Promise<StoredItem | null> {
  const result = await query(collection(name)).eq('instanceId', instanceId).eq(field, value).limit(1).find();
  return result.items[0] as StoredItem | undefined ?? null;
}

export async function createItem(name: string, instanceId: string, data: Record<string, unknown>): Promise<StoredItem> {
  return await insert(collection(name), { _id: crypto.randomUUID(), ...data, instanceId }) as StoredItem;
}

export async function updateItem(name: string, instanceId: string, id: string, data: Record<string, unknown>): Promise<StoredItem> {
  const existing = await findOne(name, instanceId, '_id', id);
  if (!existing) throw new Error('ITEM_NOT_FOUND');
  return await update(collection(name), { ...existing, ...data, _id: id, instanceId }) as StoredItem;
}

export async function removeItem(name: string, instanceId: string, id: string): Promise<void> {
  const existing = await findOne(name, instanceId, '_id', id);
  if (!existing) throw new Error('ITEM_NOT_FOUND');
  await remove(collection(name), id);
}

export async function claimUnique(name: string, instanceId: string, uniqueKey: string, data: Record<string, unknown>): Promise<StoredItem | null> {
  try {
    return await createItem(name, instanceId, { ...data, uniqueKey });
  } catch (error) {
    const existing = await findOne(name, instanceId, 'uniqueKey', uniqueKey);
    if (existing) return null;
    throw error;
  }
}
