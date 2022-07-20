package dblink

import (
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/go-sql-driver/mysql"
	// "github.com/gorilla/mux"
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
	VoiceID  uint      `xorm:"voice_id"`       // 音声のID
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

type VoiceJson struct {
	Name      string
	Read      string
	Address   string
	AttrTypes []string
}

// 初期化用
var (
	PASSWORD string
	USER     string
	ADDRESS  string
	DB       string
	ENGINE   xorm.Engine
)

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
		fmt.Printf("成功です: %s\n", table.Tables_in_hureru_voice)
	}
}

// insert テーブルにレコードを追加する
func insert(engine xorm.Engine) {
	attrTypes := make([]AttrType, 0)
	voices := make([]Voice, 0)
	attrs := make([]Attr, 0)

	for i := 0; i < 10; i++ {
		n := AttrType{
			Name: fmt.Sprintf("type:%d", 1),
		}
		attrTypes = append(attrTypes, n)
	}

	for j := 0; j < 1000; j++ {
		voices = append(voices, Voice{Name: fmt.Sprintf("name: %d", j), Read: fmt.Sprintf("read: %d", j), Address: fmt.Sprintf("address: %d", j)})
		for k := 0; k < 3; k++ {
			attrs = append(attrs, Attr{VoiceID: uint(j + 1), TypeID: uint((j+k)%len(attrTypes) + 1)})
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

	result, err3 := engine.Table("voice").Insert(voices)
	if err != nil {
		log.Fatal(err3)
	}
	fmt.Println(result)

	fmt.Println("レコードの追加が完了しました。")
}

// get 単体取得(1レコードを取得)
func get(engine xorm.Engine) {
	attrTypes := []AttrType{}
	err := getEngine().Find(&attrTypes)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("取得したレコード :%+v\n", attrTypes)
}

func init() {
	PASSWORD = os.Getenv("MYSQL_ROOT_PASSWORD")
	USER = "root"
	ADDRESS = "hureru_button_db"
	DB = "hureru_voice"

	engine := getEngine()

	allDropTables(*engine)
	createTable(*engine)
	insert(*engine)
}

func FindAttr() {
	attrTypes := []AttrType{}
	err := getEngine().Find(&attrTypes)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("取得したレコード :%+v\n", attrTypes)

	attrs := []Attr{}
	err1 := getEngine().Find(&attrs)
	if err != nil {
		log.Fatal(err1)
	}
	fmt.Printf("取得したレコード :%+v\n", attrs)

	voices := []Voice{}
	err2 := getEngine().Find(&voices)
	if err != nil {
		log.Fatal(err2)
	}
	fmt.Printf("取得したレコード :%+v\n", voices)
}

func getEngine() *xorm.Engine {
	st := fmt.Sprintf("%s:%s@tcp(%s:3306)/%s?charset=utf8mb4&parseTime=true", USER, PASSWORD, ADDRESS, DB)
	engine, err := xorm.NewEngine("mysql", st)
	if err != nil {
		log.Fatal(err)
	}
	return engine
}
