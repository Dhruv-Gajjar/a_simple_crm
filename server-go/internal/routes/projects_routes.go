package routes

import (
	"founder-diary/internal/handlers"

	"github.com/gin-gonic/gin"
)

func SetupProjectsRoutes(rg *gin.RouterGroup, projectHandler *handlers.ProjectHandler) {
	rg.GET("/", projectHandler.GetAllProjects)
	rg.GET("/:id", projectHandler.GetProjectByID)
	rg.POST("/", projectHandler.CreateProject)
	rg.PATCH("/:id", projectHandler.UpdateProject)
	rg.DELETE("/:id", projectHandler.DeleteProject)
}
