package parseapi

import (
	"hureru_button.com/hureru_button/db"
)

func GetVoiceData() (*DBStruct, error) {
	return getDBStruct(
		"./yaml/voicelist.yml",
		func(data []VoiceYaml) (*DBStruct, error) {
			voices := make([]db.Voice, 0, 20)
			attrs := make([]db.Attr, 0, 20)
			for i, v := range data {
				voices = append(voices, db.Voice{Name: v.Name, Address: v.Address, Read: v.Read, DelFlg: false})
				for _, v2 := range v.AttrIds {
					attrs = append(attrs, db.Attr{VoiceID: uint64(i + 1), TypeID: v2, DelFlg: false})
				}
			}
			return &DBStruct{Voices: voices, Attrys: attrs}, nil
		},
	)
}

func GetAttrData() ([]db.AttrType, error) {
	return getDBStruct(
		"./yaml/attrlist.yml",
		func(data []AttrTypeYaml) ([]db.AttrType, error) {
			attrTypes := make([]db.AttrType, 0, 10)
			for _, v := range data {
				attrTypes = append(attrTypes, db.AttrType{ID: v.ID, Name: v.Name})
			}
			return attrTypes, nil
		},
	)
}
