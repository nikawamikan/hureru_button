import React from 'react';

type Props = {
    onchange: React.ChangeEventHandler<HTMLInputElement>,
};

function WordFiltering(props: Props) {
    return (
        <div className='d-flex'>
            <input type='text' id='filteringWord' className='form-control px-2' placeholder='検索ワード' onChange={(e) => { props.onchange(e) }}></input>
        </div>
    );
}

export default WordFiltering;
