/*
DB管理用パッケージ
あんまり使い方わかってない模様
UNIQUE制約とかが機能してない気がする
*/

package db

import (
	"fmt"
	"log"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"xorm.io/xorm"
)

type Voice struct {
	ID       uint64    `xorm:"id pk autoincr"`      // ID
	Name     string    `xorm:"name varchar(64)"`    // 表記名
	Read     string    `xorm:"kana varchar(128)"`   // アルファベット表記の読み
	Address  string    `xorm:"address varchar(64)"` // ファイルのアドレス（prefix除く）
	DelFlg   bool      `xorm:"del_flg"`             // 削除フラグ
	UpdateAt time.Time `xorm:"updated"`             // 日時
}

type Attr struct {
	ID       uint      `xorm:"id pk autoincr"` // ID
	VoiceID  uint64    `xorm:"voice_id"`       // 音声のID
	TypeID   uint      `xorm:"type_id"`        // 属性のID
	DelFlg   bool      `xorm:"del_flg"`        // 削除フラグ
	UpdateAt time.Time `xorm:"updated"`        // 日時
}

type AttrType struct {
	ID       uint      `xorm:"id pk autoincr"`   // ID
	Name     string    `xorm:"name varchar(20)"` // 属性の名前
	DelFlg   bool      `xorm:"del_flg"`          // 削除フラグ
	UpdateAt time.Time `xorm:"updated"`          // 日時
}

type LastUpdate struct {
	ID       uint      `xorm:"id pk autoincr"`   // ID
	Name     string    `xorm:"name varchar(20)"` // テーブル名とJson名
	UpdateAt time.Time `xorm:"created"`          // 最終更新日
}

// 初期化用
var (
	PASSWORD string
	USER     string
	ADDRESS  string
	DB       string
	ENGINE   xorm.Engine
)

// DB接続に必要な変数を初期化します
func SetInit(password string, user string, address string, db string) {
	PASSWORD = password
	USER = user
	ADDRESS = address
	DB = db

	engine := getEngine()

	// 存在するテーブルすべて削除する
	// allDropTables(*engine)

	// テーブルの作成
	createTable(*engine)

	// テスト用データの挿入
	// insert(*engine)
}

// createTable テーブルを作成する
func createTable(engine xorm.Engine) {

	create := func(v any) {
		err := engine.CreateTables(v)
		if err != nil {
			log.Fatalf("テーブルの生成に失敗しました。: %v", err)
		}
		fmt.Println("テーブル作成が成功しました。")
	}
	create(Voice{})
	create(Attr{})
	create(AttrType{})
	create(LastUpdate{})
}

func allDropTables(engine xorm.Engine) {
	type table struct {
		Tables_in_hureru_voice string
	}
	l := []table{}
	err := engine.SQL("show tables").Find(&l)
	if err != nil {
		fmt.Printf("err%v", err)
	}
	for _, table := range l {
		_, err := engine.Exec(fmt.Sprintf("drop table %s", table.Tables_in_hureru_voice))
		if err != nil {
			log.Fatalf("テーブル削除に失敗: %v", err)
		}
		fmt.Printf("%s : DROP TABLE\n", table.Tables_in_hureru_voice)
	}
}

func GetAttrTypes() []AttrType {
	attrTypes := []AttrType{}
	err := getEngine().Find(&attrTypes, &AttrType{DelFlg: false})
	if err != nil {
		log.Fatal(err)
	}
	return attrTypes
}

func GetVoices() []Voice {
	voices := []Voice{}
	err := getEngine().Find(&voices, &Voice{DelFlg: false})
	if err != nil {
		log.Fatal(err)
	}
	return voices
}

func GetAttrs() []Attr {
	attrs := []Attr{}
	err := getEngine().Find(&attrs, &Attr{DelFlg: false})
	if err != nil {
		log.Fatal(err)
	}
	return attrs
}

func getEngine() *xorm.Engine {
	st := fmt.Sprintf("%s:%s@tcp(%s:3306)/%s?charset=utf8mb4&parseTime=true", USER, PASSWORD, ADDRESS, DB)
	engine, err := xorm.NewEngine("mysql", st)
	if err != nil {
		log.Fatal(err)
	}
	return engine
}
