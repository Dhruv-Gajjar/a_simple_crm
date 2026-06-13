package handlers

import (
	"errors"
	"net/http"

	"founder-diary/internal/dtos"
	"founder-diary/internal/models"
	"founder-diary/internal/repositories"
	"founder-diary/internal/services"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type TransactionHandler struct {
	transactionService services.TransactionService
}

func NewTransactionHandler(service services.TransactionService) *TransactionHandler {
	return &TransactionHandler{transactionService: service}
}

func (h *TransactionHandler) GetAll(c *gin.Context) {
	var transactionEntities []*models.Transactions

	transactions, err := h.transactionService.GetAll(c.Request.Context(), transactionEntities)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not retrive transactions.!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "All transactions fetch sucessfully.!",
		"data":    transactions,
	})
}

func (h *TransactionHandler) GetByID(c *gin.Context) {
	var transactionEntity *models.Transactions

	transactionIDStr := c.Param("id")
	transactionID, parseErr := uuid.Parse(transactionIDStr)

	if parseErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID type.!"})
	}

	transaction, err := h.transactionService.GetByID(c.Request.Context(), transactionEntity, transactionID)

	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Transaction not found.!"})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error.!", "err": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Transaction Fetch sucesfully.!",
		"data":    transaction,
	})
}

func (h *TransactionHandler) Create(c *gin.Context) {
	input := &dtos.CreateTransactionDto{}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	transaction, err := h.transactionService.Create(c.Request.Context(), input)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create transaction.!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Transaction created sucessfully.!",
		"data":    transaction,
	})
}

func (h *TransactionHandler) Update(c *gin.Context) {
	transactionIDStr := c.Param("id")
	transactionID, parseErr := uuid.Parse(transactionIDStr)

	if parseErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID type.!"})
	}

	input := &dtos.TransactionDto{}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	transaction, err := h.transactionService.Update(c.Request.Context(), input, transactionID)

	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Transaction not found.!"})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error.!", "err": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Transaction updated sucessfully.!",
		"data":    transaction,
	})
}

func (h *TransactionHandler) Delete(c *gin.Context) {
	var transactionEntity *models.Transactions

	transactionIDStr := c.Param("id")
	transactionID, parseErr := uuid.Parse(transactionIDStr)

	if parseErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID type.!"})
	}

	transaction, err := h.transactionService.Delete(c.Request.Context(), transactionEntity, transactionID)

	if err != nil {
		if err == gorm.ErrRecordNotFound {

			c.JSON(http.StatusNotFound, gin.H{"error": "Transaction not found.!"})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Transaction deleted sucessfully.!",
		"data":    transaction,
	})
}
