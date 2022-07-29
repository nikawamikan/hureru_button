/*
フロントエンドで利用するJSONとMP3データを提供するAPI
*/
package apis

import (
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
	"hureru_button.com/hureru_button/db"
)

var PREFIX string

func SetInit(prefix string) {
	PREFIX = prefix + "hurerubutton/api/voice/"
}

type VoiceJson struct {
	Name    string `json:"name"`
	Read    string `json:"read"`
	Address string `json:"address"`
	AttrIds []uint `json:"attrIds"`
}

type AttrTypeJson struct {
	Id   uint   `json:id`
	Name string `json:name`
}

type VoiceListJson struct {
	Prefix    string         `json:"prefix"`
	AttrTypes []AttrTypeJson `json:"attrType"`
	Voices    []VoiceJson    `json:"voices"`
}

func SetApis(e echo.Echo) {
	e.GET("/voicelist", voicelist)
	e.GET("/voice/:name", getVoice)
}

func voicelist(c echo.Context) error {
	return c.JSON(http.StatusOK, voiceListBuilder())
}

// Voiceデータを送信する
func getVoice(c echo.Context) error {
	name := c.Param("name")
	return c.File(fmt.Sprintf("./voice/%s", name))
}

func voiceListBuilder() VoiceListJson {
	getAttrsMap := func() []AttrTypeJson {
		attrTypes := db.GetAttrTypes()
		attrTypeJson := []AttrTypeJson{}
		for _, obj := range attrTypes {
			attrTypeJson = append(attrTypeJson, AttrTypeJson{obj.ID, obj.Name})
		}
		return attrTypeJson
	}
	getVoiceList := func() []VoiceJson {
		voices := db.GetVoices()
		voiceList := []VoiceJson{}
		getAttrIdMap := func() map[uint64][]uint {
			attrs := db.GetAttrs()
			attrMap := make(map[uint64][]uint)
			for _, obj := range attrs {
				attrMap[obj.VoiceID] = append(attrMap[obj.VoiceID], obj.TypeID)
			}
			return attrMap
		}
		attrMap := getAttrIdMap()
		getAttrIds := func(i uint64) []uint {
			if val, ok := attrMap[i]; ok {
				return val
			}
			return []uint{}
		}
		for _, obj := range voices {
			voiceList = append(voiceList,
				VoiceJson{
					Name:    obj.Name,
					Read:    obj.Read,
					Address: obj.Address,
					AttrIds: getAttrIds(obj.ID),
				},
			)
		}
		return voiceList
	}
	return VoiceListJson{Prefix: PREFIX, AttrTypes: getAttrsMap(), Voices: getVoiceList()}
}
