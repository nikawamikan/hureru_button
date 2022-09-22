import React from 'react';

type Props = {
    onclick: React.MouseEventHandler<HTMLButtonElement>,
    label: string
};

function VoiceButton(props: Props) {
    return (
        <button className='btn btn-voice mb-3 me-3' onClick={props.onclick}>{props.label}</button>
    );
}

export default VoiceButton;
