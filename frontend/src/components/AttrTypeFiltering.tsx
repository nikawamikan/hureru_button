import React from 'react';
import AttrType from '../types/AttrType';
import AttrTypeFilteringButton from './AttrTypeFilteringButton';

type Props = {
    attrTypes: AttrType[],
    onclick: (attrId: number) => void
};

function AttrTypeFiltering(props: Props) {
    const attrTypes = props.attrTypes.slice();
    return (
        <div>
            {attrTypes.map((attrType) => {
                return (
                    <AttrTypeFilteringButton onclick={() => props.onclick(attrType.id)} label={attrType.name} />
                );
            })}
        </div>
    );
}

export default AttrTypeFiltering;
