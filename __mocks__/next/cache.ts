import { vi } from 'vitest';

export let unstable_cache = vi.fn((f) => f);
export let revalidatePath = vi.fn();
export let revalidateTag = vi.fn();
export let unstable_noStore = vi.fn();
