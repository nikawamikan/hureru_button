import React from 'react';
import Voice from '../types/Voice';

type Props = {
    baseAddress: string,
    voice: Voice,
};

function VoiceAudio(props: Props) {
    const address = props.baseAddress + props.voice.address;
    return (
        <div className='mb-2'>
            <audio src={address} autoPlay controls></audio>
        </div>
    );
}

export default VoiceAudio;
