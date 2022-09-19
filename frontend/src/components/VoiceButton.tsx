import React from 'react';

type Props = {
    onclick: React.MouseEventHandler<HTMLButtonElement>,
    label: string
};

function VoiceButton(props: Props) {
    return (
        <button className='btn btn-primary mb-1 me-1' onClick={props.onclick}>{props.label}</button>
    );
}

export default VoiceButton;
