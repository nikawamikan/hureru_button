import React, { useEffect, useState } from 'react';
import axios from 'axios';
import VoiceListApiResponse from '../types/VoiceListApiResponse';
import AppState from '../types/AppState';
import Voice from '../types/Voice';
import AttrType from '../types/AttrType';
import WordFiltering from './WordFiltering';
import AttrTypeFiltering from './AttrTypeFiltering';
import VoiceAudio from './VoiceAudio';
import VoiceButton from './VoiceButton';

import '../css/App.css';

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
  baseAddress: '/hurerubutton/api/voice/marine',
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
  function handleVoiceAudioEnded() {
    console.log('ended');
    setSelectedVoice({
      address: 'static_audio_silence.wav',
      attrIds: [],
      name: '',
      kana: ''
    });
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

  useEffect(() => {
    // fetchVoiceList
    const target = '/hurerubutton/api/voicelist';
    axios.get(target)
      .then((response) => {
        const fetchedVoiceList: VoiceListApiResponse = response.data;
        const appState = mapToAppState(fetchedVoiceList);
        setBaseAddress(appState.baseAddress);
        setAttrTypes(appState.attrTypes);
        setVoices(appState.voices);
        setFilteredVoices(appState.voices);
        setSelectedVoice({ address: '', attrIds: [], name: '', kana: '' });
        setFilteringWords([]);
        setFilteringAttrIds([]);
      })
      .catch((error) => {
        console.log('*** ボイスデータの読み込み中にエラー発生 ***');
        console.log(error);
      });
  }, []);

  // render
  return (

    <div>

      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">ふれるボタン</a>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item dropdown">
                <div className="dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" data-bs-auto-close="outside">
                  属性
                </div>
                <AttrTypeFiltering
                  attrTypes={attrTypes}
                  onclick={handleAttrTypeFilteringButtonClick}
                />
              </li>
            </ul>

        </div>
        <div>
          <WordFiltering
                onchange={(e) => handleWordFilteringInputChange(e.target.value)}
          />
        </div>
        <VoiceAudio
          baseAddress={baseAddress}
          voice={selectedVoice}
          onended={handleVoiceAudioEnded}
        />
      </nav>
      <div className='container p-4'>
        <AttrTypeFiltering
          attrTypes={attrTypes}
          onclick={handleAttrTypeFilteringButtonClick}
        />
        <div className='d-flex justify-content-between flex-wrap'>
          {filteredVoices.map((voice) => {
            return (
              <VoiceButton
                onclick={() => handleVoiceButtonClick(voice)}
                label={voice.name}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function mapToAppState(res: VoiceListApiResponse) {
  const appState: AppState = {
    baseAddress: res.prefix,
    attrTypes: mapToAttrTypes(res.attrType),
    voices: mapToVoices(res.voices),
    filteredVoices: mapToVoices(res.voices),
    selectedVoice: {
      address: '',
      attrIds: [],
      name: '',
      kana: ''
    },
    filteringWords: [],
    filteringAttrIds: [],
  };

  return appState;
}

function mapToAttrTypes(resAttrType: { id: number, name: string }[]) {
  const attrTypes: AttrType[] = resAttrType.map((rat) => {
    return {
      id: rat.id,
      name: rat.name,
    }
  });
  return attrTypes;
}

function mapToVoices(resVoices: { name: string, read: string, address: string, attrIds: number[] }[]) {
  const voices: Voice[] = resVoices.map((resVoice) => {
    return {
      address: resVoice.address,
      attrIds: resVoice.attrIds,
      name: resVoice.name,
      kana: resVoice.read,
    };
  });
  return voices;
}

export default App;
