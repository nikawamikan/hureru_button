package parseapi

import (
	"fmt"
	"io/ioutil"

	"github.com/go-yaml/yaml"
	"hureru_button.com/hureru_button/db"
)

type AttrTypeYaml struct {
	ID   uint   `yaml:"id"`   // ID
	Name string `yaml:"name"` // 属性の名前
}

type VoiceYaml struct {
	AttrIds []uint `yaml:"attrIds"` // 属性IDの配列
	Name    string `yaml:"name"`    // 表記名
	Read    string `yaml:"read"`    // アルファベット表記の読み
	Address string `yaml:"address"` // ファイルのアドレス（prefix除く）
}

type DBStruct struct {
	Voices []db.Voice
	Attrys []db.Attr
}

type Test interface {
	*DBStruct | []db.AttrType
}

type Yaml interface {
	VoiceYaml | AttrTypeYaml
}

func getDBStruct[T Test, Y Yaml](path string, fn func([]Y) (T, error)) (T, error) {

	buf, err := ioutil.ReadFile(path)
	if err != nil {
		return nil, err
	}

	ReadOnStruct := func(fileBuffer []byte) ([]Y, error) {
		data := make([]Y, 20)
		err := yaml.Unmarshal(fileBuffer, &data)
		if err != nil {
			fmt.Println(err)
			return nil, err
		}
		return data, nil
	}

	data, err := ReadOnStruct(buf)
	if err != nil {
		return nil, err
	}

	f, err := fn(data)
	if err != nil {
		return nil, err
	}

	return f, nil
}
