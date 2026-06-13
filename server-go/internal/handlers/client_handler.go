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

type ClientHandler struct {
	clientService services.ClientService
}

func NewClientHandler(service services.ClientService) *ClientHandler {
	return &ClientHandler{clientService: service}
}

func (h *ClientHandler) GetAllClients(c *gin.Context) {
	page := c.Query("page")
	limit := c.Query("limit")

	var clients []*models.Clients
	var clientRes *models.ClientResponse

	clientRes, err := h.clientService.GetAllClients(c.Request.Context(), clients, page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not retrive clients.!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":        "All clients fetch sucessfully.!",
		"clients":        clientRes.ActiveClients,
		"total_clients":  clientRes.Total,
		"active_clients": clientRes.Active,
	})
}

func (h *ClientHandler) GetClientByID(c *gin.Context) {
	var client *models.Clients
	clientIDStr := c.Param("id")
	clientID, parseErr := uuid.Parse(clientIDStr)

	if parseErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID type.!"})
	}

	client, err := h.clientService.GetClientByID(c.Request.Context(), client, clientID)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Client not found.!"})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error.!", "err": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Client Fetch sucesfully.!",
		"data":    client,
	})
}

func (h *ClientHandler) CreateClient(c *gin.Context) {
	clientInput := &dtos.CreateClientDto{}
	if err := c.ShouldBindJSON(&clientInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	client, err := h.clientService.CreateClient(c.Request.Context(), clientInput)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create client.!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Client created sucessfully.!",
		"data":    client,
	})
}

func (h *ClientHandler) UpdateClient(c *gin.Context) {
	clientIDStr := c.Param("id")
	clientID, parseErr := uuid.Parse(clientIDStr)

	if parseErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID type.!"})
	}

	clientInput := &dtos.ClientDto{}

	if err := c.ShouldBindJSON(&clientInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	client, err := h.clientService.UpdateClient(c.Request.Context(), clientInput, clientID)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Client not found.!"})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error.!", "err": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Client updated sucessfully.!",
		"data":    client,
	})
}

func (h *ClientHandler) DeleteClient(c *gin.Context) {
	var client *models.Clients
	clientIDStr := c.Param("id")
	clientID, parseErr := uuid.Parse(clientIDStr)

	if parseErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID type.!"})
	}

	client, err := h.clientService.DeleteClient(c.Request.Context(), client, clientID)
	if err != nil {
		if err == gorm.ErrRecordNotFound {

			c.JSON(http.StatusNotFound, gin.H{"error": "Client not found.!"})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Client deleted sucessfully.!",
		"data":    client,
	})
}
