import React from 'react';
import Voice from '../types/Voice';

type Props = {
    baseAddress: string,
    voice: Voice,
    onended: () => void,
};

function VoiceAudio(props: Props) {
    const address = props.baseAddress + props.voice.address;
    return (
        <div className='mb-2'>
            <audio src={address} autoPlay controls onEnded={props.onended}></audio>
        </div>
    );
}

export default VoiceAudio;
