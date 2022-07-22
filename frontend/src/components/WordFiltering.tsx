import React from 'react';

type Props = {
    onchange: React.ChangeEventHandler<HTMLInputElement>,
    onclick: React.MouseEventHandler<HTMLButtonElement>
};

function WordFiltering(props: Props) {
    return (
        <div>
            <input type='text' id='filteringWord' onChange={(e) => { props.onchange(e) }}></input>
            <button onClick={props.onclick}>検索</button>
        </div>
    );
}

export default WordFiltering;
