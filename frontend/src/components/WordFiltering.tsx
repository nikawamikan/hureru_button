import React from 'react';

type Props = {
    onchange: React.ChangeEventHandler<HTMLInputElement>,
};

function WordFiltering(props: Props) {
    return (
        <div>
            <span>ボタン名／読み 検索</span>
            <input type='text' id='filteringWord' placeholder='検索ワード' onChange={(e) => { props.onchange(e) }}></input>
        </div>
    );
}

export default WordFiltering;
