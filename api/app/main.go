package main

import (
	"os"

	"github.com/labstack/echo/v4"
	"hureru_button.com/hureru_button/apis"
	"hureru_button.com/hureru_button/db"
)

func main() {
	// 定数のセット
	db.SetInit(os.Getenv("MYSQL_ROOT_PASSWORD"), "root", "hureru_button_db", "hureru_voice")
	apis.SetInit(os.Getenv("ADDRESS_BASE"))

	// APIを設定
	e := echo.New()
	apis.SetApis(*e)

	// APIを常駐させる
	e.Logger.Fatal(e.Start(":80"))
}
