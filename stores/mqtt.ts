import { iconMap } from '@/components/commons/toast/Toast';
import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'

export type MqttMessage = {
    message: string;
    type: keyof typeof iconMap;
}

export type MqttQueue = MqttMessage & {
    id: string;
}

export type MqttList = MqttQueue & {
    receivedAt: number;
}

interface MqttState {
    messages: MqttList[];
    toast: MqttQueue[];
    setMessage: (message: MqttQueue) => void;
    removeToast: (id: string) => void;
    removeMessage: (id: string) => void;
    clearToast: () => void;
    clearAll: () => void;
}

const useMqttStore = create<MqttState>()(
    devtools(
        persist(
            (set, get) => ({
                messages: [],
                toast: [],
                setMessage: (message) => set((state) => ({
                    messages: [{ ...message, receivedAt: Date.now() }, ...state.messages],
                    toast: [...state.toast, message]
                })),
                removeToast: (id) => set((state) => ({
                    toast: state.toast.filter(t => t.id !== id),
                })),
                removeMessage: (id) => set((state) => ({
                    messages: state.messages.filter(t => t.id !== id),
                })),
                clearToast: () => set(() => ({ toast: [] })),
                clearAll: () => set(() => ({ messages: [], toast: [] }))
            }),
            {
                name: 'mqtt-storage', // unique name
                storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
            }
        )
    )
)

export default useMqttStore;