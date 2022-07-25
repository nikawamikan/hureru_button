import AttrType from "./AttrType";
import Voice from "./Voice";

type AppState = {
    baseAddress: string,
    attrTypes: AttrType[],
    voices: Voice[],
    filteredVoices: Voice[],
    selectedVoice: Voice,
    filteringWords: string[],
    filteringAttrIds: number[],
};

export default AppState;
