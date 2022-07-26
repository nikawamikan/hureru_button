import React, { useEffect, useState } from 'react';
import AppState from '../types/AppState';
import Voice from '../types/Voice';
import WordFiltering from './WordFiltering';
import AttrTypeFiltering from './AttrTypeFiltering';
import VoiceAudio from './VoiceAudio';
import VoiceButton from './VoiceButton';

import '../css/App.css';
import axios from 'axios';

// 初期データ（音声ファイルのアドレス要修正）
const _voices: Voice[] = [
  {
    address: '/static_audio_1_汎用_18_00_青.mp3',
    attrIds: [0,],
    name: '青',
    kana: 'あお'
  },
  {
    address: '/static_audio_1_汎用_18_01_赤.mp3',
    attrIds: [1,],
    name: '赤',
    kana: 'あか'
  },
  {
    address: '/static_audio_1_汎用_18_03_黒.mp3',
    attrIds: [0, 1,],
    name: '黒',
    kana: 'くろ'
  },
];

// 初期データ
const _state: AppState = {
  baseAddress: '/mp3/marine',
  attrTypes: [
    { id: 0, name: '属性A' },
    { id: 1, name: '属性B' },
  ],
  voices: _voices,
  filteredVoices: _voices,
  selectedVoice: {
    address: '',
    attrIds: [],
    name: '',
    kana: ''
  },
  filteringWords: [],
  filteringAttrIds: [],
};

function App() {
  // state
  const [baseAddress, setBaseAddress] = useState(_state.baseAddress);
  const [attrTypes, setAttrTypes] = useState(_state.attrTypes);
  const [voices, setVoices] = useState(_state.voices);
  const [filteredVoices, setFilteredVoices] = useState(_state.filteredVoices);
  const [selectedVoice, setSelectedVoice] = useState(_state.selectedVoice);
  const [filteringWords, setFilteringWords] = useState(_state.filteringWords);
  const [filteringAttrIds, setFilteringAttrIds] = useState(_state.filteringAttrIds);

  // handle functions
  function handleVoiceButtonClick(voice: Voice) {
    setSelectedVoice(voice);
  }
  function handleWordFilteringInputChange(word: string) {
    const newFilteringWords = word.replace(/\s+/, ' ').trim().split(' ');
    setFilteringWords(newFilteringWords);
    filterVoiceList(
      newFilteringWords,
      filteringAttrIds.slice()
    );
  }
  function handleAttrTypeFilteringButtonClick(attrId: number) {
    // ボタン状態トグル
    let newFilteringAttrIds = filteringAttrIds.slice();
    if (newFilteringAttrIds.includes(attrId)) {
      newFilteringAttrIds = newFilteringAttrIds.filter((attrId_) => (attrId_ !== attrId));
    } else {
      newFilteringAttrIds.push(attrId);
    }
    setFilteringAttrIds(newFilteringAttrIds);

    // フィルター関数呼び出し。検索ワード:そのまま現在値、検索属性:新しい値
    filterVoiceList(
      filteringWords.slice(),
      newFilteringAttrIds
    );
  }
  function filterVoiceList(filteringWords: string[], filteringAttrIds: number[]) {
    let newFilteredVoices = voices.slice();
    // 検索ワードについてAND検索
    for (let i = 0; i < filteringWords.length; i++) {
      const filteringWord = filteringWords[i];
      newFilteredVoices = newFilteredVoices.filter(
        (voice) => {
          const regex = new RegExp(filteringWord);
          return (
            voice.name.match(regex) || voice.kana.match(regex)
          );
        }
      );
    }
    // 属性IDについてAND検索
    for (let i = 0; i < filteringAttrIds.length; i++) {
      const filteringZokuseiID = filteringAttrIds[i];
      newFilteredVoices = newFilteredVoices.filter(
        (voice) => {
          return (
            voice.attrIds.includes(filteringZokuseiID)
          );
        }
      );
    }
    // stateフィルタリング結果をに反映
    setFilteredVoices(newFilteredVoices);
  }

  // render
  return (
    <div className='container p-4'>
      <WordFiltering
        onchange={(e) => handleWordFilteringInputChange(e.target.value)}
      />
      <AttrTypeFiltering
        attrTypes={attrTypes}
        onclick={handleAttrTypeFilteringButtonClick}
      />
      <VoiceAudio
        baseAddress={baseAddress}
        voice={selectedVoice}
      />
      <div>
        {filteredVoices.map((voice) => {
          return (
            <VoiceButton
              onclick={() => handleVoiceButtonClick(voice)}
              label={'ボタン: ' + voice.name}
            />
          );
        })}
      </div>
      <AxiosSample />
    </div>
  );
}

type ApiResponseType = {
  message: string,
  results: {
    address1: string,
    address2: string,
    address3: string,
    kana1: string,
    kana2: string,
    kana3: string,
    prefcode: string,
    zipcode: string
  }[],
  status: number
} | null;

function AxiosSample() {
  const [result, setResult] = useState<ApiResponseType>(null);

  useEffect(() => {
    const target = 'https://zipcloud.ibsnet.co.jp/api/search?zipcode=0620911'
    axios.get(target).then((response) => {
      setResult(response.data);
    });
  }, []);

  return (
    <div>
      <p>Axios Sample</p>
      <span>fetching result</span><br />
      {
        result ?
          <div>
            {result.results.map((r, i) => {
              return (
                <div>
                  <span>result[{i + 1}]: </span><br />
                  ---<span>address1: {r.address1}</span><br />
                  ---<span>address2: {r.address2}</span><br />
                  ---<span>address3: {r.address3}</span><br />
                  ---<span>kana1: {r.kana1}</span><br />
                  ---<span>kana2: {r.kana2}</span><br />
                  ---<span>kana3: {r.kana3}</span><br />
                  ---<span>prefcode: {r.prefcode}</span><br />
                  ---<span>zipcode: {r.zipcode}</span><br />
                </div>
              );
            })}
          </div> :
          'loading...'
      }
    </div>
  );

}



export default App;
