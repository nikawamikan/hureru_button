import React from 'react';

type Props = {
    onclick: any,
    label: string,
};

function AttrTypeFilteringButton(props: Props) {
    return (
        <button className='btn btn-attr mb-1 me-1' data-bs-toggle='button' onClick={props.onclick}>{props.label}</button>
    );
}

export default AttrTypeFilteringButton;
