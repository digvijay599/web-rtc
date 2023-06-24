import { useRef, useCallback, useEffect } from 'react';
import { useStateWithCallback } from '../hooks/useStateWithCallback';
import { socketInit } from '../socket';
import { ACTIONS } from '../actions';

export const useWebRTC = (roomId, user) => {
    const [clients, setClients] = useStateWithCallback(user);
    const audioElements = useRef({});
    const connections = useRef({});
    const localMediaStream = useRef(null);
    const socket = useRef(null);

    const provideRef = (instance, userId) => {
        audioElements.current[userId] = instance;
    }

    useEffect(() => {
        socket.current = socketInit();
    }, [])

    const addNewClients = useCallback(
        (newClient, cb) => {
            const lookingFor = clients.find((client) => client.id === newClient.id);
            if (lookingFor === undefined) {
                setClients((existingClients) => [...existingClients, newClient], cb)
            }
        },
        [clients, setClients],
    )


    //Capture media
    useEffect(() => {
        const startCapture = async () => {
            await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
        };
        startCapture().then(() => {
            addNewClients(user, () => {
                const localElement = audioElements.current[user.id];
                if (localElement) {
                    localElement.volume = 0;
                    localElement.secObject = localMediaStream.current;
                }

                // socket emit JSON
                socket.current.emit(ACTIONS.JOIN, {})


            })
        })
    }, [])

    return { clients, provideRef };
}

