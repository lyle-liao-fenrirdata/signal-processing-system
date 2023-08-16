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
    receivedAt: Date;
}

interface MqttState {
    messages: MqttList[];
    toast: MqttQueue[];
    setMessage: (message: MqttQueue) => void;
    removeMessage: (id: string) => void;
}

const useMqttStore = create<MqttState>()(
    devtools(
        persist(
            (set, get) => ({
                messages: [],
                toast: [],
                setMessage: (message) => set((state) => ({
                    messages: [{ ...message, receivedAt: new Date() }, ...state.messages],
                    toast: [...state.toast, message]
                })),
                removeMessage: (id) => set((state) => ({
                    toast: state.toast.filter(t => t.id !== id),
                })),
            }),
            {
                name: 'mqtt-storage', // unique name
                storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
            }
        )
    )
)

export default useMqttStore;