package handlers

import (
	"errors"
	"founder-diary/internal/dtos"
	"founder-diary/internal/models"
	"founder-diary/internal/repositories"
	"founder-diary/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ProjectHandler struct {
	projectService services.ProjectService
}

func NewProjectHandler(service services.ProjectService) *ProjectHandler {
	return &ProjectHandler{projectService: service}
}

func (h *ProjectHandler) GetAllProjects(c *gin.Context) {
	var projects []*models.Projects
	projects, err := h.projectService.GetAllProjects(c.Request.Context(), projects)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not retrive projects.!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Project Fetch sucesfully.!",
		"data":    &projects,
	})

}

func (h *ProjectHandler) GetProjectByID(c *gin.Context) {
	var project *models.Projects
	projectIDStr := c.Param("id")
	projectID, parseErr := uuid.Parse(projectIDStr)

	if parseErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID type.!"})
	}

	project, err := h.projectService.GetProjectByID(c.Request.Context(), project, projectID)

	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Project not found.!"})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error.!", "err": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Project Fetch sucesfully.!",
		"data":    &project,
	})
}

func (h *ProjectHandler) CreateProject(c *gin.Context) {
	projectInput := &dtos.CreateProjectDTO{}
	if err := c.ShouldBindJSON(&projectInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	project, err := h.projectService.Create(c.Request.Context(), projectInput)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create Project.!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Project created sucessfully.!",
		"data":    project,
	})
}

func (h *ProjectHandler) UpdateProject(c *gin.Context) {
	projectIDStr := c.Param("id")
	projectID, parseErr := uuid.Parse(projectIDStr)

	if parseErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID type.!"})
	}

	projectInput := &dtos.ProjectDTO{}

	if err := c.ShouldBindJSON(&projectInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	project, err := h.projectService.Update(c.Request.Context(), projectInput, projectID)

	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Project not found.!"})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error.!", "err": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Project updated sucessfully.!",
		"data":    project,
	})
}

func (h *ProjectHandler) DeleteProject(c *gin.Context) {
	var project *models.Projects
	projectIDStr := c.Param("id")
	projectID, parseErr := uuid.Parse(projectIDStr)

	if parseErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID type.!"})
	}

	project, err := h.projectService.Delete(c.Request.Context(), project, projectID)

	if err != nil {
		if err == gorm.ErrRecordNotFound {

			c.JSON(http.StatusNotFound, gin.H{"error": "Project not found.!"})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Project deleted sucessfully.!",
		"data":    project,
	})
}
