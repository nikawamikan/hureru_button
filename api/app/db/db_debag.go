package db

import (
	"fmt"
	"log"

	"xorm.io/xorm"
)

// テストデータをテーブルに追加する
func insert(engine xorm.Engine) {
	attrTypes := make([]AttrType, 0)
	voices := make([]Voice, 0)
	attrs := make([]Attr, 0)
	for i := 0; i < 10; i++ {
		n := AttrType{
			Name: fmt.Sprintf("type:%d", i),
		}
		attrTypes = append(attrTypes, n)
	}
	for j := 0; j < 20; j++ {
		voices = append(voices, Voice{Name: fmt.Sprintf("name: %d", j), Read: fmt.Sprintf("read: %d", j), Address: fmt.Sprintf("address: %d", j)})
		for k := 0; k < 3; k++ {
			attrs = append(attrs, Attr{VoiceID: uint64(j + 1), TypeID: uint((j+k)%len(attrTypes) + 1)})
		}
	}
	r, err := engine.Table("attr_type").Insert(attrTypes)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(r)
	_, err2 := engine.Table("attr").Insert(attrs)
	if err != nil {
		log.Fatal(err2)
	}
	_, err3 := engine.Table("voice").Insert(voices)
	if err != nil {
		log.Fatal(err3)
	}

	fmt.Println("レコードの追加が完了しました。")
}
