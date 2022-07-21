import React from 'react';

type Props = {
    onclick: React.MouseEventHandler<HTMLButtonElement>,
    label: string
};

function VoiceButton(props: Props) {
    return (
        <button onClick={props.onclick}>{props.label}</button>
    );
}

export default VoiceButton;
