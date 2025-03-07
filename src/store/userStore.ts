import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface UserState {
    user_id: string | null;
    fetchUserId: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
    user_id: null,

    fetchUserId: async () => {
        const { data, error } = await supabase.auth.getUser();
        if (data?.user?.id) {
            set({ user_id: data.user.id });
        } else {
            console.error('Error fetching user ID:', error);
        }
    },
}));
