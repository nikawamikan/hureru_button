package main

import (
	"os"

	"github.com/labstack/echo/v4"
	"hureru_button.com/hureru_button/apis"
	"hureru_button.com/hureru_button/db"
	"hureru_button.com/hureru_button/parseapi"
)

func main() {
	// 定数のセット
	db.SetInit(os.Getenv("MYSQL_ROOT_PASSWORD"), "root", "hureru_button_db", "hureru_voice")
	apis.SetInit(os.Getenv("ADDRESS_BASE"))

	// APIを設定
	e := echo.New()
	apis.SetApis(*e)

	data, err := parseapi.GetVoiceData()
	if err != nil {
		// log.Fatalln(err)
	}

	data2, err := parseapi.GetAttrData()
	if err != nil {
		// log.Fatalln(err)
	}

	result, err := db.Insert(data.Voices)
	if err != nil || result <= 0 {
		// log.Fatalln(err, result)
	}

	result, err = db.Insert(data.Attrys)
	if err != nil || result <= 0 {
		// log.Fatalln(err, result)
	}

	result, err = db.Insert(data2)
	if err != nil || result <= 0 {
		// log.Fatalln(err, result)
	}

	// APIを常駐させる
	e.Logger.Fatal(e.Start(":80"))
}
