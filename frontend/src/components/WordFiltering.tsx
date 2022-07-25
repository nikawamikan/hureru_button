import React from 'react';

type Props = {
    onchange: React.ChangeEventHandler<HTMLInputElement>,
};

function WordFiltering(props: Props) {
    return (
        <div className='input-group mb-2'>
            <span className='input-group-text'>ボタン名／読み 検索</span>
            <input type='text' id='filteringWord' className='border' placeholder='検索ワード' onChange={(e) => { props.onchange(e) }}></input>
        </div>
    );
}

export default WordFiltering;
