package routes

import (
	"founder-diary/internal/handlers"

	"github.com/gin-gonic/gin"
)

func SetupNotesRoutes(rg *gin.RouterGroup, handler *handlers.NotesHandler) {

	rg.GET("/", handler.GetAll)
	rg.POST("/", handler.Create)
	rg.PATCH("/:id", handler.Update)
}
