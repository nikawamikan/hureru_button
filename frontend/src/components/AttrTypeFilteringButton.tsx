import React from 'react';

type Props = {
    onclick: any,
    label: string,
};

function AttrTypeFilteringButton(props: Props) {
    return (
        <button onClick={props.onclick}>{props.label}</button>
    );
}

export default AttrTypeFilteringButton;
