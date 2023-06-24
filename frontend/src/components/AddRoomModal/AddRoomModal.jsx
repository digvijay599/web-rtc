import React, { useState } from "react";
import Styles from "./AddRoomModal.module.css";
import TextInput from "./../shared/TextInput/TextInput";
import { createRoom as create } from "../../http";
import { useHistory } from "react-router-dom";

const AddRoomModal = ({ onClose }) => {
    const [roomType, setRoomType] = useState("open");
    const [topic, setTopic] = useState();

    const history = useHistory();

    const createRoom = async () => {
        try {
            if (!topic) return;
            console.log({ topic, roomType });
            const { data } = await create({ topic, roomType });
            history.push(`/room/${data.id}`);
            console.log(data);
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className={Styles.modalMask}>
            <div className={Styles.modalBody}>
                <button className={Styles.closeButton} onClick={onClose}>
                    <img src="/images/close.png" alt="close" />
                </button>
                <div className={Styles.modalHeading}>
                    <h3 className={Styles.heading}>
                        Enter the topic to be disscussed
                    </h3>
                    <TextInput
                        fullwidth="true"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                    />
                    <h2 className={Styles.subheading}>Room Types</h2>
                    <div className={Styles.roomTypes}>
                        <div
                            className={`${Styles.typeBox} ${
                                roomType === "open" ? Styles.active : ""
                            }`}
                            onClick={() => setRoomType("open")}
                        >
                            <img src="/images/globe.png" alt="globe" />
                            <span>Open</span>
                        </div>
                        <div
                            className={`${Styles.typeBox} ${
                                roomType === "social" ? Styles.active : ""
                            }`}
                            onClick={() => setRoomType("social")}
                        >
                            <img src="/images/social.png" alt="social" />
                            <span>Social</span>
                        </div>
                        <div
                            className={`${Styles.typeBox} ${
                                roomType === "private" ? Styles.active : ""
                            }`}
                            onClick={() => setRoomType("private")}
                        >
                            <img src="/images/lock.png" alt="lock" />
                            <span>Private</span>
                        </div>
                    </div>
                </div>
                <div className={Styles.modalFooter}>
                    <h2>Start a room, open to everyone</h2>
                    <button
                        className={Styles.footerButton}
                        onClick={createRoom}
                    >
                        <img src="/images/celebration.png" alt="celebration" />
                        <span>Let's go</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddRoomModal;
