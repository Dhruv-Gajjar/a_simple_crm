package routes

import (
	"founder-diary/internal/handlers"

	"github.com/gin-gonic/gin"
)

func SetupClientRoutes(rg *gin.RouterGroup) {
	rg.GET("/", handlers.GetClient)
	rg.POST("/", handlers.CreateClient)
}
