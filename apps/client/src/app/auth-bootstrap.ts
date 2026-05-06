import { useAuthStore } from "@/stores/auth.store";

let bootstrapPromise: Promise<void> | null = null;

export function ensureAuthBootstraped() {
    if (!bootstrapPromise) {
        bootstrapPromise = useAuthStore.getState().bootstrap()
    }

    return bootstrapPromise;
}