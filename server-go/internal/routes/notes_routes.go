package routes

import (
	"founder-diary/internal/handlers"

	"github.com/gin-gonic/gin"
)

func SetupNotesRoutes(rg *gin.RouterGroup, handler *handlers.NotesHandler) {

	rg.GET("/", handler.GetAll)
	rg.GET("/:id", handler.GetByID)
	rg.POST("/", handler.Create)
	rg.PATCH("/:id", handler.Update)
	rg.DELETE("/:id", handler.Delete)
}
