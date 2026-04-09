package handlers

import (
	"errors"
	"net/http"
	"strconv"

	"founder-diary/internal/dtos"
	"founder-diary/internal/repositories"
	"founder-diary/internal/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ClientHandler struct {
	clientService services.ClientService
}

func NewClientHandler(service services.ClientService) *ClientHandler {
	return &ClientHandler{clientService: service}
}

func (h *ClientHandler) GetAllClients(c *gin.Context) {
	clients, err := h.clientService.GetAllClients(c.Request.Context())

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not retrive clients.!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "All clients fetch sucessfully.!",
		"data":    clients,
	})
}

func (h *ClientHandler) GetClientByID(c *gin.Context) {
	clientIdStr := c.Param("id")
	clientId, err := strconv.ParseUint(clientIdStr, 10, 32)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid client ID format.!"})
	}

	client, err := h.clientService.GetClientByID(c.Request.Context(), uint(clientId))

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
		"data":    &client,
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
	clientID, idErr := strconv.ParseUint(clientIDStr, 10, 32)

	if idErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid client ID format.!"})
	}

	clientInput := &dtos.ClientDto{}

	if err := c.ShouldBindJSON(&clientInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	client, err := h.clientService.UpdateClient(c.Request.Context(), clientInput, uint(clientID))

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
	clientIdStr := c.Param("id")
	clientID, err := strconv.ParseUint(clientIdStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid client ID format.!"})
	}
	client, err := h.clientService.DeleteClient(c.Request.Context(), uint(clientID))

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
